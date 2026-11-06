import { useReducer, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { plans, optionalCharges } from "@/data/pricing-catalog.js";
import { industries } from "@/data/industries.js";
import { featureAreaOrder } from "@/data/feature-order.js";
import { capabilityStates, AVAILABILITY } from "@/data/feature-states.js";
import { countryCodes } from "@/data/countries.js";
import { industryAreas } from "@/data/industry-areas.js";
import { track, EVENTS } from "@/lib/analytics.js";
import { STEPS, DRAFT_KEY, PLAN_IDS, BILLING } from "@/lib/configurator/constants.js";
import { defaultState, sanitizeState, decodeState } from "@/lib/configurator/model.js";
import { toPlansById } from "@/lib/configurator/plan-rules.js";
import { recommendPlan, usefulOptions } from "@/lib/configurator/recommend.js";
import { estimate } from "@/lib/configurator/estimate.js";
import {
  visibleModuleIds,
  quotaOf,
  recommendModules,
  moduleInfo,
  labelModules,
} from "@/lib/configurator/modules.js";

const plansById = toPlansById(plans);
const catalog = { plansById, optionalCharges };

const validScope = {
  industries,
  modules: featureAreaOrder.filter((key) => capabilityStates[key] !== AVAILABILITY.HIDDEN),
  areas: featureAreaOrder.filter((key) => capabilityStates[key] !== AVAILABILITY.HIDDEN),
  countries: countryCodes,
  addOns: optionalCharges.addOns.map((a) => a.id),
  connectors: optionalCharges.connectors.map((c) => c.id),
};

function getInitialState(searchParams) {
  const cParam = searchParams.get("c");
  if (cParam) {
    const decoded = decodeState(cParam);
    if (decoded) {
      const sanitized = sanitizeState(decoded, validScope);
      return {
        step: "summary",
        data: sanitized,
        saved: false,
        shared: true,
        error: null,
      };
    }
  }

  const def = defaultState();
  const planParam = searchParams.get("plan");
  const billingParam = searchParams.get("billing");

  if (planParam && PLAN_IDS.includes(planParam.toLowerCase())) {
    def.plan = planParam.toLowerCase();
  }
  if (billingParam && BILLING.includes(billingParam.toLowerCase())) {
    def.billing = billingParam.toLowerCase();
  }
  const industryParam = searchParams.get("industry");
  if (industryParam) {
    const trimmed = industryParam.trim().toLowerCase();
    if (industries.includes(trimmed) || trimmed === "other") {
      def.industry = trimmed;
    }
  }

  return {
    step: "intro",
    data: def,
    saved: false,
    shared: false,
    error: null,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step, error: null, saved: false };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "PATCH_DATA":
      return { ...state, data: { ...state.data, ...action.payload }, saved: false };
    case "TOGGLE_IN": {
      const { listName, id } = action;
      const currentList = Array.isArray(state.data[listName]) ? state.data[listName] : [];
      const nextList = currentList.includes(id)
        ? currentList.filter((x) => x !== id)
        : [...currentList, id];
      return {
        ...state,
        data: { ...state.data, [listName]: nextList },
        saved: false,
      };
    }
    case "SET_INDUSTRY": {
      const { slug } = action;
      let nextModules = state.data.modules;
      if (state.data.modulesTouched) {
        // Changing the industry never wipes a touched selection; modules that are no longer compatible are removed.
        const validIds = visibleModuleIds(slug);
        nextModules = state.data.modules.filter((id) => validIds.includes(id));
      } else {
        nextModules = [];
      }

      return {
        ...state,
        data: {
          ...state.data,
          industry: slug,
          modules: nextModules,
        },
        error: null,
        saved: false,
      };
    }
    case "SET_SAVED":
      return { ...state, saved: action.saved };
    case "LOAD_DRAFT":
      return {
        ...state,
        step: "profile",
        data: action.data,
        saved: false,
        shared: false,
        error: null,
      };
    case "RESET":
      return {
        step: "intro",
        data: defaultState(),
        saved: false,
        shared: false,
        error: null,
      };
    default:
      return state;
  }
}

/**
 * Hook providing all configurator state, actions, validation, tracking, and calculations.
 */
export function useConfigurator() {
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(reducer, searchParams, getInitialState);

  // Check if saved draft exists in localStorage
  const hasDraft = useMemo(() => {
    if (typeof window === "undefined" || !window.localStorage) return false;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return Boolean(raw);
    } catch {
      return false;
    }
  }, [state.step]);

  // Derived values
  const rec = useMemo(() => recommendPlan(state.data, plansById), [state.data]);
  const effectivePlan = state.data.plan || rec.planId;
  const planQuota = useMemo(() => quotaOf(effectivePlan, plansById), [effectivePlan]);

  // Standard modules derivation
  const visibleModules = useMemo(
    () => visibleModuleIds(state.data.industry),
    [state.data.industry],
  );

  const recommendedModules = useMemo(
    () => recommendModules(state.data.industry, planQuota, industryAreas, visibleModules),
    [state.data.industry, planQuota, visibleModules],
  );

  const effectiveModules = useMemo(() => {
    if (state.data.modulesTouched) {
      return state.data.modules.filter((id) => visibleModules.includes(id));
    }
    return recommendedModules;
  }, [state.data.modulesTouched, state.data.modules, visibleModules, recommendedModules]);

  const info = useMemo(
    () => moduleInfo(effectiveModules, effectivePlan, plansById),
    [effectiveModules, effectivePlan],
  );

  const labels = useMemo(
    () => labelModules(effectiveModules, info.included),
    [effectiveModules, info.included],
  );

  // State with effectiveModules passed to options and estimate
  const calcState = useMemo(
    () => ({
      ...state.data,
      effectiveModules,
      modules: effectiveModules,
    }),
    [state.data, effectiveModules],
  );

  const options = useMemo(
    () => usefulOptions(calcState, effectivePlan),
    [calcState, effectivePlan],
  );
  const est = useMemo(
    () => estimate(calcState, effectivePlan, catalog),
    [calcState, effectivePlan],
  );

  // Actions
  const toggleModule = useCallback(
    (id) => {
      const isCurrentlySelected = effectiveModules.includes(id);
      const nextModules = isCurrentlySelected
        ? effectiveModules.filter((x) => x !== id)
        : [...effectiveModules, id];

      dispatch({
        type: "PATCH_DATA",
        payload: {
          modules: nextModules,
          modulesTouched: true,
        },
      });

      const nextInfo = moduleInfo(nextModules, effectivePlan, plansById);
      track(EVENTS.MODULES_CHANGE, {
        selected: nextInfo.selected,
        included: nextInfo.included,
      });
    },
    [effectiveModules, effectivePlan],
  );

  const resetModules = useCallback(() => {
    dispatch({
      type: "PATCH_DATA",
      payload: {
        modules: [],
        modulesTouched: false,
      },
    });

    const nextInfo = moduleInfo(recommendedModules, effectivePlan, plansById);
    track(EVENTS.MODULES_CHANGE, {
      selected: nextInfo.selected,
      included: nextInfo.included,
    });
  }, [recommendedModules, effectivePlan]);

  const start = useCallback(() => {
    track(EVENTS.CONFIGURATOR_START);
    track(EVENTS.CONFIGURATOR_STEP, { step: 0 });
    dispatch({ type: "SET_STEP", step: "profile" });
  }, []);

  const resume = useCallback(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const sanitized = sanitizeState(parsed, validScope);
        track(EVENTS.CONFIGURATOR_START);
        track(EVENTS.CONFIGURATOR_STEP, { step: 0 });
        dispatch({ type: "LOAD_DRAFT", data: sanitized });
      }
    } catch {
      start();
    }
  }, [start]);

  const startAgain = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore
    }
    dispatch({ type: "RESET" });
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore
    }
    dispatch({ type: "RESET" });
  }, []);

  const goTo = useCallback(
    (targetStep) => {
      const idx = STEPS.indexOf(targetStep);
      if (idx >= 0) {
        track(EVENTS.CONFIGURATOR_STEP, { step: idx });
        dispatch({ type: "SET_STEP", step: targetStep });
      }
    },
    [state.step],
  );

  const back = useCallback(() => {
    if (state.step === "intro") return;
    const currentIdx = STEPS.indexOf(state.step);
    if (currentIdx === 0) {
      dispatch({ type: "SET_STEP", step: "intro" });
    } else if (currentIdx > 0) {
      const prevStep = STEPS[currentIdx - 1];
      track(EVENTS.CONFIGURATOR_STEP, { step: currentIdx - 1 });
      dispatch({ type: "SET_STEP", step: prevStep });
    }
  }, [state.step]);

  const next = useCallback(() => {
    const currentIdx = STEPS.indexOf(state.step);
    if (state.step === "profile") {
      if (!state.data.industry) {
        dispatch({ type: "SET_ERROR", error: "industry" });
        return;
      }
    }

    if (currentIdx >= 0 && currentIdx < STEPS.length - 1) {
      const nextStep = STEPS[currentIdx + 1];
      track(EVENTS.CONFIGURATOR_STEP, { step: currentIdx + 1 });
      dispatch({ type: "SET_STEP", step: nextStep });
    }
  }, [state.step, state.data.industry]);

  const patch = useCallback(
    (payload) => {
      if (payload.plan && payload.plan !== state.data.plan) {
        track(EVENTS.PLAN_SELECT, {
          plan: payload.plan,
          billing: state.data.billing,
        });
      }
      if (payload.billing && payload.billing !== state.data.billing) {
        track(EVENTS.BILLING_CHANGE, {
          billing: payload.billing,
        });
      }
      dispatch({ type: "PATCH_DATA", payload });
    },
    [state.data.plan, state.data.billing],
  );

  const toggleIn = useCallback((listName, id) => {
    dispatch({ type: "TOGGLE_IN", listName, id });
  }, []);

  const setIndustry = useCallback((slug) => {
    dispatch({ type: "SET_INDUSTRY", slug });
  }, []);

  const save = useCallback(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state.data));
      track(EVENTS.CONFIGURATOR_SAVE);
      dispatch({ type: "SET_SAVED", saved: true });
    } catch {
      // Ignore storage errors
    }
  }, [state.data]);

  return {
    step: state.step,
    data: state.data,
    error: state.error,
    saved: state.saved,
    shared: state.shared,
    hasDraft,
    plansById,
    catalog,
    rec,
    effectivePlan,
    planQuota,
    options,
    est,
    effectiveModules,
    recommendedModules,
    visibleModules,
    info,
    labels,
    toggleModule,
    resetModules,
    start,
    resume,
    startAgain,
    reset,
    goTo,
    back,
    next,
    patch,
    toggleIn,
    setIndustry,
    save,
  };
}

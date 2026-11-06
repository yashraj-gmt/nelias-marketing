// TODO(Debass): confirm which capability areas are standard modules and any sector compatibility restrictions. New sectors and specialised modules are added here and in industry-areas.js, with no other change.
import { featureAreaOrder } from "./feature-order.js";

export const standardModules = featureAreaOrder.map((id) => ({
  id,
  compatibleIndustries: null,
}));

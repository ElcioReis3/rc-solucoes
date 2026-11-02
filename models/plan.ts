export type PlanInfo = {
  /** How many products are currently registered (active + inactive). */
  productCount: number;
  /** How many the account is allowed to have right now. */
  productLimit: number;
  /** How many more a single slot-pack purchase unlocks. */
  slotPackSize: number;
};

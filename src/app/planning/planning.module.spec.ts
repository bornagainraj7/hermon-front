import { PlanningModule } from './planning.module';

describe('PlanningModule', () => {
  let planningModule: PlanningModule;

  beforeEach(() => {
    planningModule = new PlanningModule();
  });

  it('should create an instance', () => {
    expect(planningModule).toBeTruthy();
  });
});

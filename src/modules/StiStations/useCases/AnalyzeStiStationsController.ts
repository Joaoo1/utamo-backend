import { Request, Response } from 'express';
import { AnalyzeStiStationsUseCase } from './AnalyzeStiStationsUseCase';

class AnalyzeStiStationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const analyzeStiStationsUseCase = new AnalyzeStiStationsUseCase();

    const analyzedPlanFeatures = await analyzeStiStationsUseCase.execute({
      extraordinaryMaxTolerance: request.body.extraordinaryMaxTolerance,
      extraordinaryMinTolerance: request.body.extraordinaryMinTolerance,
      maxLinesInExtraordinaryMinTolerance:
        request.body.maxLinesInExtraordinaryMinTolerance,
      maxTolerance: request.body.maxTolerance,
      minTolerance: request.body.minTolerance,
      planFeatures: request.body.planFeatures,
    });

    return response.status(200).json(analyzedPlanFeatures);
  }
}

export { AnalyzeStiStationsController };

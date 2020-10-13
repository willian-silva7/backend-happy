import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';

class OrphanageController {
  async index(request: Request, response: Response): Promise<any> {
    const orphanagesRepository = getRepository(Orphanage);

    const orphanages = await orphanagesRepository.find({
      relations: ['images'],
    });

    return response.json(orphanages);
  }

  async show(request: Request, response: Response): Promise<any> {
    const { id } = request.params;
    const orphanagesRepository = getRepository(Orphanage);

    const orphanages = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images'],
    });

    return response.json(orphanages);
  }

  async create(request: Request, response: Response): Promise<any> {
    const requestImages = request.files as Express.Multer.File[];

    const {
      name,
      about,
      latitude,
      longitude,
      instructions,
      opening_hours,
      open_on_weekends,
    } = request.body;

    const orphanagesRepository = getRepository(Orphanage);
    const images = requestImages.map(image => {
      return { path: image.filename };
    });

    const orphanage = orphanagesRepository.create({
      name,
      about,
      latitude,
      longitude,
      instructions,
      opening_hours,
      open_on_weekends,
      images,
    });

    await orphanagesRepository.save(orphanage);

    return response.status(201).send(orphanage);
  }
}

export default OrphanageController;

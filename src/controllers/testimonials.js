import { TestimonialModel } from '../models/testimonial.js'

export class TestimonialController {
  static async getAll(req, res) {
    const testimonials = await TestimonialModel.getAll()
    res.json(testimonials)
  }

  static async getById(req, res) {
    const { id } = req.params

    const testimonial = await TestimonialModel.getById({ id })

    if (!testimonial)
      return res.status(404).json({
        message: 'Testimonial not found',
      })

    res.send(testimonial)
  }

  static async create(req, res) {
    const input = req.validatedInput

    const newTestimonial = await TestimonialModel.create({ input })

    res.status(201).json(newTestimonial)
  }

  static async update(req, res) {
    const { id } = req.params
    const input = req.validatedInput

    const { updatedTestimonial, result } = await TestimonialModel.update({
      id,
      input,
    })

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: 'Testimonial not found',
      })

    res.json(updatedTestimonial)
  }

  static async delete(req, res) {
    const { id } = req.params

    const { result } = await TestimonialModel.delete({ id })

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: 'Testimonial not found',
      })

    res.sendStatus(204)
  }
}

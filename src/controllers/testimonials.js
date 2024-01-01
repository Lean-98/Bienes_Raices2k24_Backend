import { TestimonialModel } from '../models/testimonial.js'
import { validate } from 'uuid'
import { validateTestimonial } from '../schemas/testimonials.js'
// import { validateTestimonial } from '../schemas/testimoniales.js'

export class TestimonialController {
  static async getAll(req, res) {
    try {
      const testimonials = await TestimonialModel.getAll()
      res.json(testimonials)
    } catch (error) {
      res.status(500).json({
        message: 'Something goes wrong',
      })
    }
  }

  static async getById(req, res) {
    const { id } = req.params
    if (!validate(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }
    const testimonial = await TestimonialModel.getById({ id })

    if (!testimonial)
      return res.status(404).json({
        message: 'Testimonial not found',
      })
    res.send(testimonial)
  }

  static async create(req, res) {
    const input = validateTestimonial(req.body)
    try {
      const newTestimonial = await TestimonialModel.create({ input })
      res.status(201).json(newTestimonial)
    } catch (error) {
      return res.status(500).json({
        message: 'Something goes wrong',
      })
    }
  }

  static async update(req, res) {
    const { id } = req.params
    const input = validateTestimonial(req.body)

    if (!validate(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }

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
    if (!validate(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }

    const { result } = await TestimonialModel.delete({ id })

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: 'Testimonial not found',
      })

    res.sendStatus(204)
  }
}

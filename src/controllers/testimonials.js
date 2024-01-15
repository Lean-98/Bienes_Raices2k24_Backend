import { TestimonialModel } from '../models/testimonial.js'

export class TestimonialController {
  static async getAll(req, res) {
    try {
      const testimonials = await TestimonialModel.getAll()
      res.json(testimonials)
    } catch (err) {
      console.error('Error when obtaining Testimonials:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async getById(req, res) {
    const { id } = req.params

    try {
      const testimonial = await TestimonialModel.getById({ id })

      if (!testimonial)
        return res.status(404).json({
          message: 'Testimonial not found',
        })

      res.send(testimonial)
    } catch (err) {
      console.error('Error when obtaining Testimonial:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async create(req, res) {
    const input = req.validatedInput

    try {
      const newTestimonial = await TestimonialModel.create({ input })

      res.status(201).json(newTestimonial)
    } catch (err) {
      console.error('Error creating Testimonial:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async update(req, res) {
    const { id } = req.params
    const input = req.validatedInput

    try {
      const { updatedTestimonial, result } = await TestimonialModel.update({
        id,
        input,
      })

      if (result.affectedRows === 0)
        return res.status(404).json({
          message: 'Testimonial not found',
        })

      res.json(updatedTestimonial)
    } catch (err) {
      console.error('Error updating Testimonial:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async delete(req, res) {
    const { id } = req.params

    try {
      const { result } = await TestimonialModel.delete({ id })

      if (result.affectedRows === 0)
        return res.status(404).json({
          message: 'Testimonial not found',
        })

      res.sendStatus(204)
    } catch (err) {
      console.error('Error when deleting a Testimonial:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }
}

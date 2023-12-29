import { Router } from 'express'
import {
  getPropiedades,
  getPropiedadId,
  crearPropiedad,
  actualizarPropiedad,
  eliminarPropiedad,
} from '../controllers/propiedades.controller.js'

const router = Router()

router.get('/', getPropiedades)
router.get('/:id', getPropiedadId)
router.post('/', crearPropiedad)
router.patch('/:id', actualizarPropiedad)
router.delete('/:id', eliminarPropiedad)

export default router

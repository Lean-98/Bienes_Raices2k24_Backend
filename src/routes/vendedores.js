import { Router } from 'express'
import {
  crearVendedor,
  eliminarVendedor,
  getVendedorId,
  getVendedores,
  actualizarVendedor,
} from '../controllers/vendedores.controller.js'

const router = Router()

router.get('/', getVendedores)
router.get('/:id', getVendedorId)
router.post('/', crearVendedor)
router.patch('/:id', actualizarVendedor)
router.delete('/:id', eliminarVendedor)

export default router

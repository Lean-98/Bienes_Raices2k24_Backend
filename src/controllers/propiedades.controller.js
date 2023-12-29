import { pool } from '../db.js'

export const getPropiedades = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, titulo, precio, imagen, descripcion, habitaciones, wc, estacionamiento, creado, vendedor_id FROM propiedades',
    )
    res.json(rows)
  } catch (error) {
    return res.status(500).json({
      message: 'Something goes wrong',
    })
  }
}

export const getPropiedadId = async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await pool.query(
      'SELECT id, titulo, precio, imagen, descripcion, habitaciones, wc, estacionamiento, creado, vendedor_id FROM propiedades WHERE id = ?',
      [id],
    )
    if (rows.length <= 0)
      return res.status(404).json({
        message: 'Propiedad not found',
      })
    res.send(rows[0])
  } catch (error) {
    return res.status(500).json({
      message: 'Something goes wrong',
    })
  }
}

export const crearPropiedad = async (req, res) => {
  const {
    titulo,
    precio,
    imagen,
    descripcion,
    habitaciones,
    wc,
    estacionamiento,
    creado,
    vendedor_id,
  } = req.body

  try {
    const [rows] = await pool.query(
      'INSERT INTO Propiedades (titulo, precio, imagen, descripcion, habitaciones, wc, estacionamiento, creado, vendedor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        titulo,
        precio,
        imagen,
        descripcion,
        habitaciones,
        wc,
        estacionamiento,
        creado,
        vendedor_id,
      ],
    )

    res.status(201).json({ id: rows.insertId, ...req.body })
  } catch (error) {
    return res.status(500).json({
      message: 'Something goes wrong',
    })
  }
}

export const actualizarPropiedad = async (req, res) => {
  const { id } = req.params
  const {
    titulo,
    precio,
    imagen,
    descripcion,
    habitaciones,
    wc,
    estacionamiento,
    creado,
    vendedor_id,
  } = req.body

  try {
    const [result] = await pool.query(
      'UPDATE propiedades SET titulo = IFNULL(?, titulo), precio = IFNULL(?, precio), imagen = IFNULL(?, imagen), descripcion = IFNULL(?, descripcion), habitaciones = IFNULL(?, habitaciones), wc = IFNULL(?, wc), estacionamiento = IFNULL(?, estacionamiento), creado = IFNULL(?, creado), vendedor_id = IFNULL(?, vendedor_id) WHERE id = ?',
      [
        titulo,
        precio,
        imagen,
        descripcion,
        habitaciones,
        wc,
        estacionamiento,
        creado,
        vendedor_id,
        id,
      ],
    )

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: 'Propiedad not found',
      })

    const [row] = await pool.query(
      'SELECT id, titulo, precio, imagen, descripcion, habitaciones, wc, estacionamiento, creado, vendedor_id FROM propiedades WHERE id = ?',
      [id],
    )
    res.json(row[0])
  } catch (error) {
    return res.status(500).json({
      message: 'Something goes wrong',
    })
  }
}

export const eliminarPropiedad = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM propiedades WHERE id = ?', [
      req.params.id,
    ])

    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: 'Propiedad not found',
      })
    res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({
      message: 'Something goes wrong',
    })
  }
}

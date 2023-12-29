import { pool } from '../db.js'

export const getVendedores = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, apellido, telefono, email, imagen FROM vendedores')
        res.json(rows)
    } catch (error) {
        res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}

export const getVendedorId = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT nombre, apellido, telefono, email, imagen FROM vendedores WHERE id = ?', [req.params.id])
        if (rows.length <= 0) return res.status(404).json({
            message: 'Vendedor not found'
        })
        res.send(rows[0])
    } catch (error) {
        res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}

export const crearVendedor = async (req, res) => {
    const { nombre, apellido, telefono, email, imagen } = req.body
    try {
        const [rows] = await pool.query('INSERT INTO vendedores(nombre, apellido, telefono, email, imagen) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, telefono, email, imagen])
        res.send({
            id: rows.insertId,
            nombre,
            apellido,
            telefono,
            email,
            imagen
        })

    } catch (error) {
        res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}


export const actualizarVendedor = async (req, res) => {
    const { id } = req.params
    const { nombre, apellido, telefono, email, imagen } = req.body

    try {
        const [result] = await pool.query('UPDATE vendedores SET nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), telefono = IFNULL(?, telefono), email = IFNULL(?, email), imagen = IFNULL(?, imagen) WHERE id = ?',
            [nombre, apellido, telefono, email, imagen, id])

        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Vendedor not found'
        })

        const [row] = await pool.query('SELECT id, nombre, apellido, telefono, email, imagen FROM vendedores WHERE id = ?', [id])
        res.json(row[0])
    } catch (error) {
        res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}

export const eliminarVendedor = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM vendedores WHERE id = ?', [req.params.id])

        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Vendedor not found'
        })
        res.sendStatus(204)
    } catch (error) {
        res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}
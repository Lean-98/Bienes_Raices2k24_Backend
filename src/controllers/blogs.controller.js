import { pool } from '../db.js'

export const getBlogs = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, titulo, fecha, escritor, contenido, imagen FROM blogs')
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}

export const getBlogId = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT titulo, fecha, escritor, contenido, imagen FROM blogs WHERE id = ?', [req.params.id])
        console.log(rows)
        if (rows.length <= 0) return res.status(404).json({
            message: 'Blog not found'
        })
        res.send(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}

export const crearBlog = async (req, res) => {
    const { titulo, fecha, escritor, contenido, imagen } = req.body

    try {
        const [rows] = await pool.query('INSERT INTO blogs(titulo, fecha, escritor, contenido, imagen) VALUES (?, ?, ?, ?, ?)',
            [titulo, fecha, escritor, contenido, imagen])
        res.send({
            id: rows.insertId,
            titulo,
            fecha,
            escritor,
            contenido,
            imagen
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}

export const actualizarBlog = async (req, res) => {
    const { id } = req.params
    const { titulo, fecha, escritor, contenido, imagen } = req.body

    try {
        const [result] = await pool.query('UPDATE blogs SET titulo = IFNULL(?, titulo), fecha = IFNULL(?, fecha), escritor = IFNULL(?, escritor), contenido = IFNULL(?, contenido), imagen = IFNULL(?, imagen) WHERE id = ?',
            [titulo, fecha, escritor, contenido, imagen, id])

        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Blog not found'
        })

        const [rows] = await pool.query('SELECT id, titulo, fecha, escritor, contenido, imagen FROM blogs WHERE id = ?', [id])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}

export const deleteBlog = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM blogs WHERE id = ?', [req.params.id])

        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Blog not found'
        })

        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}
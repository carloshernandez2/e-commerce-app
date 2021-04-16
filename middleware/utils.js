const mg = require('mailgun-js')
const jwt = require('jsonwebtoken')

module.exports = {
  generateToken (user) {
    return jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller
      },
      process.env.JWT_SECRET || 'somethingsecret',
      {
        expiresIn: '30d'
      }
    )
  },

  isAuth (req, res, next) {
    const authorization = req.headers.authorization
    if (authorization) {
      const token = authorization.slice(7, authorization.length) // Bearer XXXXXX
      jwt.verify(
        token,
        process.env.JWT_SECRET || 'somethingsecret',
        (err, decode) => {
          if (err) {
            res.status(401).send({ message: 'Invalid Token' })
          } else {
            req.user = decode
            next()
          }
        }
      )
    } else {
      res.status(401).send({ message: 'No Token' })
    }
  },

  isAdmin (req, res, next) {
    if (req.user && req.user.isAdmin) {
      next()
    } else {
      res.status(401).send({ message: 'Invalid Admin Token' })
    }
  },

  isSeller (req, res, next) {
    if (req.user && req.user.isSeller) {
      next()
    } else {
      res.status(401).send({ message: 'Invalid Seller Token' })
    }
  },

  isSellerOrAdmin (req, res, next) {
    if (req.user && (req.user.isSeller || req.user.isAdmin)) {
      next()
    } else {
      res.status(401).send({ message: 'Invalid Admin/Seller Token' })
    }
  },

  mailgun () {
    return mg({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    })
  },

  payOrderEmailTemplate (order) {
    return `<h1>Gracias por comprar con nosotros</h1>
  <p>
  Hola ${order.user.name},</p>
  <p>Hemos procesado su orden.</p>
  <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Producto</strong></td>
  <td><strong>Cantidad</strong></td>
  <td><strong align="right">Precio</strong></td>
  </thead>
  <tbody>
  ${order.orderItems
    .map(
      (item) => `
    <tr>
    <td>${item.name}</td>
    <td align="center">${item.qty}</td>
    <td align="right"> $${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('\n')}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Precio items:</td>
  <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Impuestos:</td>
  <td align="right"> $${order.taxPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Costo entrega:</td>
  <td align="right"> $${order.shippingPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2"><strong>Precio total:</strong></td>
  <td align="right"><strong> $${order.totalPrice.toFixed(2)}</strong></td>
  </tr>
  <tr>
  <td colspan="2">Método de pago:</td>
  <td align="right">${order.paymentMethod}</td>
  </tr>
  </table>
  <h2>Dirección de envío</h2>
  <p>
  ${order.shippingAddress.fullName},<br/>
  ${order.shippingAddress.address},<br/>
  ${order.shippingAddress.city},<br/>
  ${order.shippingAddress.country},<br/>
  ${order.shippingAddress.postalCode}<br/>
  </p>
  <hr/>
  <p>
  Gracias por comprar con nosotros.
  </p>
  `
  }
}

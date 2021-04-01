module.exports = {
  findSellers (orderItems) {
    const newOrderItems = []
    orderItems.forEach(item => {
      if (!newOrderItems.includes(item.seller)) {
        newOrderItems.push(item.seller)
      }
    })
    return newOrderItems.map(seller => {
      return { seller }
    })
  }
}

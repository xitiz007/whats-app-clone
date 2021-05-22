const getReceipentEmail = (users, user) => (
    users.filter(email => email !== user.email)[0]
)

export default getReceipentEmail;
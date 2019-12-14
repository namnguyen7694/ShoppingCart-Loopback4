module.exports = async (app) => {
    const Account = app.models.Account;
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;

    let account = await Account.findOne({where: {email:"namnguyen7694@gmail.com" }})
    if (!account) account = await Account.create({
        email: "namnguyen7694@gmail.com",
        password: "123456"
    })

    let role = await Role.findOne ({where : {name: "admin"}})
    if(!role) {
        role = await Role.create ({ name: "admin"})

    //mapping
        role.principals.create({
            principalType: RoleMapping.USER,
            principalId: account.id

        })
    }
}
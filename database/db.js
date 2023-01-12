const mysql=require('mysql');
const connection=mysql.createConnection({
host: 'localhost',
user: 'root',
password:'Aa5592770',
database:'conaltracoop'

});

connection.connect((error)=>{

    if(error)
    {
console.error('el error esta en: '+ error);
return

    }
        console.log('conectado exitosamente a la BD Mysql');


})

module.exports=connection;

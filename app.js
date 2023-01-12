const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

app.use("/resources", express.static("public"));
app.use("/resources", express.static(__dirname + "/public"));

app.set("view engine", "ejs");

const bcryptjs = require("bcryptjs");

const session = require("express-session");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

const connection = require("./database/db");
const { promiseImpl } = require("ejs");

app.get("/loguin", (req, res) => {
  res.render("loguin");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/registerOPE", (req, res) => {
  res.render("registerOPE");
});
///script del registro

app.post("/register", async (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const rol = req.body.rol;
  const pass = req.body.pass;
  const apellido = req.body.apellido;
  const email = req.body.email;
  const FechaNac = req.body.FechaNac;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  connection.query(
    "INSERT INTO PERFILES SET?",
    {
      usuario: user,
      nombre: name,
      apellido: apellido,
      email: email,
      fechaNacimiento: FechaNac,
      rol: rol,
      pass: passwordHaash,
    },
    async (error, results) => {
      if (error) {
        res.render("register", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "Usuario ya existe",
          alertIcon: "error",
          showConfirmButton: false,
          timer: 1500,
          ruta: "register",
        });
      } else {
        res.render("register", {
          alert: true,
          alertTitle: "Registrado",
          alertMessage: "¡registro exitoso!",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "",
        });
      }
    }
  );
});
/// registrar operario
app.post("/registerOPE", async (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const rol = req.body.rol;
  const pass = req.body.pass;
  const apellido = req.body.apellido;
  const email = req.body.email;
  const FechaNac = req.body.FechaNac;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  connection.query(
    "INSERT INTO PERFILES SET?",
    {
      usuario: user,
      nombre: name,
      apellido: apellido,
      email: email,
      fechaNacimiento: FechaNac,
      rol: rol,
      pass: passwordHaash,
    },
    async (error, results) => {
      if (error) {
        res.render("register", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "Usuario ya existe",
          alertIcon: "error",
          showConfirmButton: false,
          timer: 1500,
          ruta: "register",
        });
      } else {
        res.render("register", {
          alert: true,
          alertTitle: "Registrado",
          alertMessage: "¡registro exitoso!",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "secretaria",
        });
      }
    }
  );
});
/// Autenticacion

app.post("/auth", async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  if (user && pass) {
    connection.query(
      "SELECT * FROM PERFILES WHERE usuario= ?",
      [user],
      async (error, results) => {
        if (
          results.length == 0 ||
          !(await bcryptjs.compare(pass, results[0].pass))
        ) {
          res.render("loguin", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario O contraseña incorrecta",
            alertIcon: "error",
            showConfirmButton: true,
            timer: 2500,
            ruta: "loguin",
          });
        } else {
          req.session.loggedin = true;
          req.session.name = results[0].nombre;
          req.session.rol = results[0].rol;

          res.render("loguin", {
            alert: true,
            alertTitle: "Bienvenido ",
            alertMessage: "Bienvenido",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 2500,
            ruta: " ",
          });
        }
      }
    );
  } else {
    res.render("loguin", {
      alert: true,
      alertTitle: "Error",
      alertMessage: "Ingresar datos validos",
      alertIcon: "error",
      showConfirmButton: true,
      timer: 2500,
      ruta: "loguin",
    });
  }
});





/// autenticar las demas paginas
app.get("/", (req, res) => {


  if (req.session.loggedin && req.session.rol == "admin") {
    res.render("admin", {
      loguin: true,
      name: req.session.name,
      rol: req.session.rol,
    });
  } else if (req.session.loggedin && req.session.rol == "gerencia") {
    res.render("gerencia", {
      loguin: true,
      name: req.session.name,
      rol: req.session.rol,
    });
  } else if (req.session.loggedin && req.session.rol == "secretaria") {
    res.render("secretaria", {
      loguin: true,
      name: req.session.name,
    });
  } else if (req.session.loggedin && req.session.rol == "operario") {
    res.render("operativo", {
      loguin: true,
      name: req.session.name,
      rol: req.session.rol,
    });
  } else {
    res.render("index", {
      loguin: false,

      name: "Debe iniciar session",
    });
  }
});

app.get("/register", (req, res) => {
  if (req.session.loggedin) {
    res.render("register", {
      loguin: true,
    });
  } else {
    res.render("index", {
      loguin: false,
    });
  }
});

app.get('/update',(req,res)=>{
  if (req.session.loggedin){
    connection.query('SELECT * FROM perfiles',(error,results)=>{
if(error){
    throw error;
}else{
    res.render('update',{results:results});
}

    });
  }else{
    res.render("index", {
      loguin: false,
      name: 'debes iniciar'
    });
  }
})

app.get('/edit/:id', (req,res)=>{

  const usuario =req.params.id;

  connection.query('SELECT * FROM perfiles WHERE usuario=?',[usuario], (error,results)=>{

      if(error){
          throw error;
      }else{
          res.render('edit',{usuario:results[0]});
      }
      
  })

})

/// cerrar sesion

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/loguin");
  });
});



app.listen(3000, (req, res) => {
  console.log("servidor en http://localHost:3000");
});

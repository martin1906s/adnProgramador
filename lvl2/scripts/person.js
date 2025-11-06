const caracteristicas = {
  gorra: Boolean,
  lentes: Boolean,
  edad: { niño: Boolean, adulto: Boolean },
  sexo: { hombre: Boolean, mujer: Boolean },
  ropa: { color: String },
  pelo: { largo: Boolean, corto: Boolean },
};

const persona1 = {
  img: "4.png",
  gorra: (caracteristicas.gorra = true),
  lentes: (caracteristicas.lentes = true),
  edad: (caracteristicas.edad.adulto = true),
  sexo: (caracteristicas.sexo.hombre = true),
  ropa: (caracteristicas.ropa.color = "Negro"),
  pelo: (caracteristicas.pelo.corto = true),
};

const persona2 = {
  img: "5.png",
  gorra: (caracteristicas.gorra = true),
  lentes: (caracteristicas.lentes = true),
  edad: (caracteristicas.edad.adulto = true),
  sexo: (caracteristicas.sexo.mujer = true),
  ropa: (caracteristicas.ropa.color = "Azul"),
  pelo: (caracteristicas.pelo.largo = true),
};

const persona3 = {
  img: "6.png",
  gorra: (caracteristicas.gorra = false),
  lentes: (caracteristicas.lentes = true),
  edad: (caracteristicas.edad.niño = true),
  sexo: (caracteristicas.sexo.hombre = true),
  ropa: (caracteristicas.ropa.color = "Azul"),
  pelo: (caracteristicas.pelo.corto = true),
};

const persona4 = {
  img: "7.png",
  gorra: (caracteristicas.gorra = false),
  lentes: (caracteristicas.lentes = true),
  edad: (caracteristicas.edad.niño = true),
  sexo: (caracteristicas.sexo.mujer = true),
  ropa: (caracteristicas.ropa.color = "Blanco"),
  pelo: (caracteristicas.pelo.largo = true),
};

const persona5 = {
  img: "1.png",
  gorra: (caracteristicas.gorra = false),
  lentes: (caracteristicas.lentes = false),
  edad: (caracteristicas.edad.niño = true),
  sexo: (caracteristicas.sexo.hombre = true),
  ropa: (caracteristicas.ropa.color = "Rojo"),
  pelo: (caracteristicas.pelo.corto = true),
};

const persona6 = {
  img: "3.png",
  gorra: (caracteristicas.gorra = false),
  lentes: (caracteristicas.lentes = false),
  edad: (caracteristicas.edad.adulto = true),
  sexo: (caracteristicas.sexo.hombre = true),
  ropa: (caracteristicas.ropa.color = "Amarillo"),
  pelo: (caracteristicas.pelo.largo = true),
};

const persona7 = {
  img: "2.png",
  gorra: (caracteristicas.gorra = true),
  lentes: (caracteristicas.lentes = false),
  edad: (caracteristicas.edad.adulto = true),
  sexo: (caracteristicas.sexo.mujer = true),
  ropa: (caracteristicas.ropa.color = "Rojo"),
  pelo: (caracteristicas.pelo.largo = true),
};

const persona8 = {
  img: "8.png",
  gorra: (caracteristicas.gorra = true),
  lentes: (caracteristicas.lentes = true),
  edad: (caracteristicas.edad.niño = true),
  sexo: (caracteristicas.sexo.hombre = true),
  ropa: (caracteristicas.ropa.color = "Verde"),
  pelo: (caracteristicas.pelo.corto = true),
};

const persona9 = {
  img: "9.png",
  gorra: (caracteristicas.gorra = true),
  lentes: (caracteristicas.lentes = false),
  edad: (caracteristicas.edad.niño = true),
  sexo: (caracteristicas.sexo.mujer = true),
  ropa: (caracteristicas.ropa.color = "Rosa"),
  pelo: (caracteristicas.pelo.largo = true),
};

const persona10 = {
  img: "10.png",
  gorra: (caracteristicas.gorra = false),
  lentes: (caracteristicas.lentes = true),
  edad: (caracteristicas.edad.adulto = true),
  sexo: (caracteristicas.sexo.hombre = true),
  ropa: (caracteristicas.ropa.color = "Blanco"),
  pelo: (caracteristicas.pelo.largo = true),
};

const persona11 = {
  img: "11.png",
  gorra: (caracteristicas.gorra = true),
  lentes: (caracteristicas.lentes = false),
  edad: (caracteristicas.edad.adulto = true),
  sexo: (caracteristicas.sexo.hombre = true),
  ropa: (caracteristicas.ropa.color = "Negro"),
  pelo: (caracteristicas.pelo.largo = true),
};

const persona12 = {
  img: "12.png",
  gorra: (caracteristicas.gorra = false),
  lentes: (caracteristicas.lentes = false),
  edad: (caracteristicas.edad.adulto = true),
  sexo: (caracteristicas.sexo.mujer = true),
  ropa: (caracteristicas.ropa.color = "Amarillo"),
  pelo: (caracteristicas.pelo.largo = true),
};

const persona13 = {
  img: "13.png",
  gorra: false,
  lentes: false,
  edad: (caracteristicas.edad.adulto = true),
  sexo: (caracteristicas.sexo.mujer = true),
  ropa: (caracteristicas.ropa.color = "Negro"),
  pelo: (caracteristicas.pelo.corto = true),
};

const persona14 = {
  img: "14.png",
  gorra: true,
  lentes: true,
  edad: (caracteristicas.edad.niño = true),
  sexo: (caracteristicas.sexo.mujer = true),
  ropa: (caracteristicas.ropa.color = "Blanco"),
  pelo: (caracteristicas.pelo.largo = true),
};

const personas = [
  persona1,
  persona2,
  persona3,
  persona4,
  persona5,
  persona6,
  persona7,
  persona8,
  persona9,
  persona10,
  persona11,
  persona12,
  persona13,
  persona14,
];

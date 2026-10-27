export const brl = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
export const dataBR = (d) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(d);
export const mesAbrev = (m) => ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"][m - 1];

# sesion-05-correlacion Specification

## Purpose

Cubre la entrada de la sesión 5, donde se encadenan varianza, covarianza y correlación.
Es la base de la que depende el bloque 3: sin la fórmula de la correlación, el coseno del
ángulo entre dos flechas del círculo no se puede justificar.

## Requirements

### Requirement: Fórmula de la varianza
EL SISTEMA SHALL mostrar en la entrada la fórmula de la varianza.

#### Scenario: La varianza se ve escrita
- **WHEN** alguien abre la entrada de la sesión 5
- **THEN** la fórmula de la varianza se lee en pantalla

### Requirement: Fórmula de la covarianza
EL SISTEMA SHALL mostrar en la entrada la fórmula de la covarianza.

#### Scenario: La covarianza se ve escrita
- **WHEN** alguien abre la entrada de la sesión 5
- **THEN** la fórmula de la covarianza se lee en pantalla

### Requirement: Fórmula del coeficiente de correlación
EL SISTEMA SHALL mostrar en la entrada la fórmula del coeficiente de correlación de
Pearson.

#### Scenario: La correlación de Pearson se ve escrita
- **WHEN** alguien abre la entrada de la sesión 5
- **THEN** la fórmula del coeficiente de correlación de Pearson se lee en pantalla

### Requirement: La covarianza de una variable consigo misma
EL SISTEMA SHALL explicar en la entrada que la covarianza de una variable consigo misma
es su varianza.

#### Scenario: Se enuncia la identidad
- **WHEN** alguien lee la entrada tras ver las dos primeras fórmulas
- **THEN** se explica que la covarianza de una variable consigo misma es su varianza

### Requirement: La desviación típica como raíz de la varianza
EL SISTEMA SHALL explicar en la entrada que la desviación típica es la raíz cuadrada de
la varianza.

#### Scenario: Se enuncia la relación
- **WHEN** alguien lee la entrada
- **THEN** se explica que la desviación típica es la raíz cuadrada de la varianza

### Requirement: La correlación como covarianza normalizada
EL SISTEMA SHALL explicar en la entrada que la correlación es la covarianza dividida por
el producto de las desviaciones típicas.

#### Scenario: Se encadena la tercera fórmula con las dos anteriores
- **WHEN** alguien lee la entrada
- **THEN** se explica que la correlación es la covarianza dividida por el producto de las desviaciones típicas

### Requirement: La correlación no tiene unidades
EL SISTEMA SHALL enunciar en la entrada que la correlación no tiene unidades.

#### Scenario: Se enuncia la ausencia de unidades
- **WHEN** alguien lee la entrada
- **THEN** se enuncia que la correlación no tiene unidades

### Requirement: La correlación está acotada
EL SISTEMA SHALL enunciar en la entrada que la correlación está acotada entre −1 y +1.

#### Scenario: Se enuncia la cota
- **WHEN** alguien lee la entrada
- **THEN** se enuncia que la correlación está acotada entre −1 y +1

### Requirement: Un diagrama de dispersión sobre el que leer la correlación
EL SISTEMA SHALL mostrar en la entrada un diagrama de dispersión sobre el que se lee la
correlación que acaba de definir.

#### Scenario: La fórmula se apoya en un dibujo
- **WHEN** alguien lee la entrada después de la fórmula de la correlación
- **THEN** ve un diagrama de dispersión sobre el que esa correlación se lee

### Requirement: El diagrama de dispersión se nombra, no se construye
EL SISTEMA SHALL nombrar ese diagrama de dispersión en la entrada sin desarrollar cómo
se construye.

#### Scenario: La construcción se deja para el bloque 1
- **WHEN** alguien lee la entrada
- **THEN** el diagrama de dispersión se nombra y se usa
- **AND** no se desarrolla allí cómo se construye

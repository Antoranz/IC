//variables
let inicio;
let fin = [];
let currFin = 0;
let nFilas = 0;
let nColumnas = 0;
var caminoFinal;
var minLength = 1000000000000000;

class Nodo {
  constructor(x, y, g, h, predecesor) {
    this.x = x;
    this.y = y;
    this.g = g; // Costo acumulado desde el nodo inicial hasta este nodo
    this.h = h; // Heurística (distancia estimada desde este nodo hasta el nodo final)
    this.predecesor = predecesor; // Nodo predecesor en el camino óptimo
  }

  esIgual(nodo) {
    return this.x === nodo.x && this.y === nodo.y;
  }

  // Función para calcular la prioridad en la cola de prioridad
  getPrioridad() {
    return this.g + this.h;
  }
}

class ColaPrioridad {
  constructor(comparador) {
    this.elementos = [];
    this.comparador = comparador;
  }

  push(elemento) {
    this.elementos.push(elemento);
    this.elementos.sort(this.comparador);
  }

  pop() {
    return this.elementos.shift();
  }

  empty() {
    return this.elementos.length === 0;
  }

  contains(nodo) {
    return this.elementos.some((elemento) => elemento.esIgual(nodo));
  }
}

function compararPorPrioridad(a, b) {
  return a.getPrioridad() - b.getPrioridad();
}

function calcularDistancia(x, y, fin) {
  return Math.sqrt(Math.pow(fin[0] - x, 2) + Math.pow(fin[1] - y, 2));
}



function pintarRecorridoGrafo(inicio, fin, nFilas, nColumnas) {
  caminoFinal = null;
  minLength = 1000000000000000;
  let colaAbierta = new ColaPrioridad(compararPorPrioridad);
  let colaCerrada = new ColaPrioridad(compararPorPrioridad);

  if (inicio!=""&& inicio!=undefined && fin!="" && fin!=[]&& fin!=undefined) {
    inicio = inicio.split(":").map(Number);
    fin = fin.split(":").map(Number);
    colaAbierta.push(new Nodo(inicio[0], inicio[1], 0, calcularDistancia(inicio[0], inicio[1], fin), null));
    recorrerNodo(colaAbierta, colaCerrada, nFilas, nColumnas, fin);
  }
}

function recorrerNodo(colaAbierta, colaCerrada, nFilas, nColumnas, fin) {
  let nodoOptimo = colaAbierta.pop();

  let coor = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[-1,1],[1,-1]];

  coor.forEach(function (c) {
    let nuevaX = nodoOptimo.x + c[0];
    let nuevaY = nodoOptimo.y + c[1];
    let g = nodoOptimo.g + calcularDistancia(nodoOptimo.x, nodoOptimo.y, [nuevaX, nuevaY]);
    let h = calcularDistancia(nuevaX, nuevaY, fin);
    let nodo = new Nodo(nuevaX, nuevaY, g, h, nodoOptimo);

    if (nuevaX >= 0 && nuevaX < nColumnas && nuevaY >= 0 && nuevaY < nFilas &&
        !checkObstaculo(nuevaX, nuevaY) && !colaCerrada.contains(nodo)) {
      if (nodo.x === fin[0] && nodo.y === fin[1]) {
        reconstruirCamino(nodo);
        return; 
      }
      if (!colaAbierta.contains(nodo) || g < nodo.g) {
        nodo.predecesor = nodoOptimo;
        colaAbierta.push(nodo);
      }
    }
  });

  colaCerrada.push(nodoOptimo);

  if (!colaAbierta.empty()) {
    recorrerNodo(colaAbierta, colaCerrada, nFilas, nColumnas, fin);
  }
}


function reconstruirCamino(nodo) {
  let camino = [];
  while (nodo !== null) {
    camino.push([nodo.x, nodo.y]);
    nodo = nodo.predecesor;
  }
  
  if(camino.length < minLength){
    caminoFinal = camino;
    minLength = caminoFinal.length;
  }
}

function checkObstaculo(x,y){
  const pathId = "#" +x+ "\\:" +y;
  return $(pathId).hasClass("obstaculo");
}

function crearTablaConEjemplo(nFilas,nColumnas,i,f,obstaculo) {
  reset();
  const nFilasE = nFilas;
  const nColumnasE = nColumnas;
  const inicioPos = i; // Posición de inicio
  const finPos = f; // Posiciones de fin
  const obstaculosPos = obstaculo; // Posiciones de obstáculos
  let tabla = "";
  for (let r = 0; r < nFilasE; r++) {
    tabla += "<tr>";
    for (let c = 0; c < nColumnasE; c++) {
      let clase = "suelo";
      if (inicioPos[0] === r && inicioPos[1] === c) {
        clase = "start";
        inicio = r + ":" + c;
      } else if (finPos.some(posicion => posicion[0] === r && posicion[1] === c)) {
        clase = "end";
        let aux = "";
        aux = r + ":" + c;
        console.log(aux)
        fin.push(aux);
      } else if (obstaculosPos.some(posicion => posicion[0] === r && posicion[1] === c)) {
        clase = "obstaculo";
      }
      tabla += `<td id="${r}:${c}" class="${clase}"></td>`;
    }
    tabla += "</tr>";
  }

  $("#tabla").html(tabla);

  let $play = $('<button class="btn btn-primary m-2">Start</button>');
  $play.on("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    pintarRecorridoGrafo(inicio, fin[currFin], nFilas, nColumnas);
    if (fin.length > currFin + 1) currFin++;
    console.log(caminoFinal);
    if (caminoFinal != null) {
      caminoFinal.forEach(function(e, index) {
        console.log(e);
        if (index != 0 && index != caminoFinal.length - 1) {
          var lastMove = [];
          lastMove[0] = prev[0] - e[0];
          lastMove[1] = prev[1] - e[1];
          const pathId = "#" + e[0] + "\\:" + e[1];
          $(pathId).removeClass("start end obstaculo").addClass("flecha" + (~~lastMove[0]) + "" + (~~lastMove[1]));
        }
        prev = e;
      });
      inicio = fin[currFin - 1];
    } else {
      alert("No se puede llegar al destino!");
    }
  });
  
  $("#play").html($play);
    
    document.documentElement.style.setProperty('--nFilas', nFilas);
    document.documentElement.style.setProperty('--nColumnas', nColumnas);

    $("td").click(function() {
      selectedCell = $(this);
      $('#optionModal').modal('show'); 
    });
}
function reset(){
   //inicializacion
   inicio="";
   fin=[];
   currFin = 0;
   nFilas = $("#nFilas").val();
   nColumnas = $("#nColumnas").val();
   caminoFinal= [];
   minLength = 1000000000000000;
}

$(document).ready(function(){


  $("#boton").on("click",function(){
    reset(); 
    let filas="";
    for(let r=0; r<nFilas; r++){
      filas+= "<tr>";
      for(let c=0; c<nColumnas; c++){
        filas+= `<td id="${r+":"+c}" class="suelo"></td>`;
      }
      filas+= "</tr>";
    }

    let $play = `<button class="btn btn-primary">Start</button>`
    
    $("#play").html($play);

    $("#play").on("click", function(){
      try {
        pintarRecorridoGrafo(inicio,fin[currFin],nFilas,nColumnas);
        if(fin.length > currFin+1) currFin++;
        console.log(caminoFinal);
        if(caminoFinal != null){
        caminoFinal.forEach(function(e,index){
          console.log(e);
          if(index != 0 && index != caminoFinal.length-1){
            var lastMove = [];
            lastMove[0] = prev[0] - e[0];
            lastMove[1] = prev[1] - e[1];
            const pathId = "#" +e[0]+ "\\:" +e[1];
            $(pathId).removeClass("start end obstaculo").addClass("flecha"+(~~lastMove[0])+ "" + (~~lastMove[1]));
          }
          prev = e;
        })
        inicio = fin[currFin-1];
        }
        else{
          alert("No se puede llegar al destino!")
        }
      } catch (error) {
        alert("Error en la configuracion, Debe haber 1 inicio, y al menos 1 final");
      }
    });

    $("#tabla").html(filas);

    document.documentElement.style.setProperty('--nFilas', nFilas);
    document.documentElement.style.setProperty('--nColumnas', nColumnas);

    $("td").click(function() {
      selectedCell = $(this);
      $('#optionModal').modal('show'); 
    });
  });

    $(".option").click(function() {
      const option = $(this).data("option");
      selectedCell.removeClass("start end obstaculo suelo").addClass(option);
      switch(option){
        case "start":
          inicio = selectedCell.attr('id');
          console.log(inicio);
          break;
        case "end":
          fin.push(selectedCell.attr('id'));
          console.log(fin);
          break;
      }
      
      $('#optionModal').modal('hide'); 
    });

var dropdownContent = document.querySelector('.dropdown-menu');

var examples = document.querySelectorAll('.dropdown-menu .dropdown-item');
examples.forEach(function(example, index) {
  example.addEventListener('click', function() {
    switch(index) {
      case 0:
        crearTablaConEjemplo(10,10,[0,0],[[2, 5], [7, 7]],[[0, 2], [1, 2], [2, 2],[3, 2],[4, 2],[5, 2],[3,0],[5,1]]);
        break;
      case 1:
        crearTablaConEjemplo(11,11,[0,0],[[0, 10]],[[0, 1], [1, 1], [2, 1],[3, 1],[4, 1],[5,1],[6, 1],[7,1],[8,1], [1, 3], [2, 3],[3, 3],[4, 3],[5,3],[6, 3],[7,3],[8,3],[9,3],[10,3],[0, 5], [1, 5], [2, 5],[3, 5],[4, 5],[5,5],[6, 5],[7,5],[8,5],[9,5], [1, 7], [2, 7],[3, 7],[4, 7],[5,7],[6, 7],[7,7],[8,7],[9,7],[10,7],[0, 9], [1, 9], [2, 9],[3, 9],[4, 9],[5,9],[6, 9],[7,9],[8,9],[9,9]]);
        break;
      case 2:
        crearTablaConEjemplo(5,5, [0,0],[[4,4]],[[0,1],[1,0],[1,1]]);
        break;
      case 3:
        crearTablaConEjemplo(8, 8, [0, 0], [[7, 7]], [[1, 1], [3, 1], [5, 1], [7, 1], [1, 3], [3, 3], [5, 3], [7, 3], [1, 5], [3, 5], [5, 5], [7, 5], [1, 7], [3, 7], [5, 7], [7, 7]]);
        break;
      case 4:
        crearTablaConEjemplo(10, 10, [5, 0], [[5,9]], [[1, 1], [1, 8], [2, 1], [2, 8], [3, 1], [3, 8], [4, 1], [4, 8], [5, 1], [5, 8], [6, 1], [6, 8], [7, 1], [7, 8], [8, 1], [8, 8], [2, 1], [2, 8], [3, 1], [3, 8], [4, 1], [4, 8], [5, 1], [5, 8], [6, 1], [6, 8], [7, 1], [7, 8], [3, 1], [3, 8], [4, 1], [4, 8], [5, 1], [5, 8], [6, 1], [6, 8], [4, 1], [4, 8], [5, 1], [5, 8], [5, 1], [5, 8]]);
        break;
      case 5:
        crearTablaConEjemplo(8, 8, [0, 0], [[7, 7]], [[1, 3], [1, 4], [1, 5], [2, 2], [2, 3], [2, 5], [2, 6], [3, 1], [3, 2], [3, 6], [3, 7], [4, 1], [4, 7], [5, 1], [5, 7], [6, 2], [6, 3], [6, 5], [6, 6], [7, 3], [7, 4], [7, 5]]);
        break;
      case 6:
        crearTablaConEjemplo(10, 10, [0, 0], [[9, 9]], [[4, 4], [4, 6], [6, 4], [6, 5], [6, 6], [5, 6], [5, 5], [0, 4], [1, 4], [3, 4], [4, 0], [4, 1], [4, 2], [4, 3], [4, 7], [4, 8], [4, 9], [5, 0], [6, 0], [6, 1], [6, 2], [6, 8], [6, 9], [5, 8], [4, 8], [8, 4], [9, 4]]);
        break;
    }
    dropdownContent.classList.remove('show');
  });
});


});




//<<<----------------------------COLOR TITULO----------------------------->>>//

function colorOriginal() {
  $(".main-titulo").animate({color: "#DCFF0E"}, 500, function() {colorSecundario()})
}
function colorSecundario() {
  $(".main-titulo").animate({color: "#606060"}, 500, function() {colorOriginal()})
}

colorOriginal();

//<<<-------------------------------GRID---------------------------------->>>//

// inicio armando tablero
  var rows=7;
  var cols = 7;
  var grid = [];
  var validFigures=0;
  var score = 0;
  var moves = 0;


  function dulce(r,c,obj,src) {
    return {
    r: r, // fila
    c: c,  // columna
    src:src, // imagen
    locked:false,
    isInCombo:false,
    o:obj
    }
  }

  // arreglo con imagenes para cada tipo de caramelo
  var images=[];
  images[0]="image/1.png";
  images[1]="image/2.png";
  images[2]="image/3.png";
  images[3]="image/4.png";

//<<<-------------------------LLENAR TABLERO------------------------------>>>//

// función que devuelve un caramelo aleatorio.
function generarDulce() {
  var rand = Math.floor((Math.random()*4));
  return images[rand];
}

// preparando el tablero
for (var r = 0; r < rows; r++) {
 grid[r]=[];
 for (var c =0; c< cols; c++) {
    grid[r][c]= new dulce(r,c,null,generarDulce());
 }
}

// creando imagenes en el tablero
for (var r = 0; r < rows; r++) {
  for (var c =0; c< cols; c++) {
    var celda = $('<img />', {
      class:'dulce',
      id: "dulce_"+r+"_"+c+"",
      src: grid[r][c].src,
      r: ""+r+"",
      c: ""+c+"",
      style: 'width: 75%; display: none'
    });
    $(".col-"+(c+1)).append(celda);
    grid[r][c].o = celda;
  }
}

//<<<----------------------------DRAG AND DROP---------------------------->>>//

$(".dulce").draggable({
  revert: true,
  containment: $('.panel-tablero'),
  refreshPositions: true,
  onDragStart: function(a) {
    a.dataTransfer.setData("text/plain", a.target.id);
  },
});

$(".dulce").droppable({
  accept: '.dulce',
  over: function(e) {
    e.preventDefault();
    console.log("pasando sobre caramelo " + e.target.id);
  },
  drop: function(event, ui){
    var src = ui.draggable.attr("id")
    var sr = src.split("_")[1];
    var sc = src.split("_")[2];

    // obtener destino del dulce
    var dst = event.target.id;
    var dr = dst.split("_")[1];
    var dc = dst.split("_")[2];

    // si la distancia es mayor a 1, no permitir el movimiento y alertar
    var ddx = Math.abs(parseInt(sr)-parseInt(dr));
    var ddy = Math.abs(parseInt(sc)-parseInt(dc));
    if (ddx > 1 || ddy > 1)
      {
        alert("Los movimientos no pueden tener una distancia mayor a 1");
        return;
      }
      else{
        console.log("intercambio " + sr + "," + sc+ " to " + dr + "," + dc);
        // intercambio de gemas
      var tmp = grid[sr][sc].src;
      grid[sr][sc].src = grid[dr][dc].src;
      grid[sr][sc].o.attr("src",grid[sr][sc].src);
      grid[dr][dc].src = tmp;
      grid[dr][dc].o.attr("src",grid[dr][dc].src);

      movimientos++;
      $('#movimientos-text').text(movimientos);
      destruirCombos();
    }
  }
});

//<<<-------------------------SEEK AND DESTROY---------------------------->>>//

function destruirCombos() {
  var prevCell = null;
  var figureLen = 0;
  var figureStart = null;
  var figureStop = null;

  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (grid[r][c].locked || grid[r][c].isInCombo) {
        figureStart = null;
        figureStop = null;
        prevCell = null;
        figureLen = 1;
        continue;
      }
      // primer objeto del combo
      if (prevCell == null) {
        prevCell = grid[r][c].src;
        figureStart = c;
        figureLen = 1;
        figureStop = null;
        continue;
      }
      else {// segundo o posterior objeto del combo
        var curCell = grid[r][c].src;
        if (!(prevCell == curCell)) {
          prevCell = grid[r][c].src;
          figureStart = c;
          figureStop = null;
          figureLen = 1;
          continue;
        } else {
            // incrementar combo
            figureLen += 1;
            if (figureLen == 3) {
              validFigures += 1;
              score += 10;
              $("#score-text").html(score);
              figureStop = c;
              for (var ci = figureStart; ci <= figureStop; ci++) {
                grid[r][ci].isInCombo = true;
                grid[r][ci].src = null;
              }
              prevCell = null;
              figureStart = null;
              figureStop = null;
              figureLen = 1;
              continue;
            }
          }
        }
      }
  } // busqueda vertical
  for (var c = 0; c < cols; c++) {
    for (var r = 0; r < rows; r++) {
      if (grid[r][c].locked || grid[r][c].isInCombo) {
        figureStart = null;
        figureStop = null;
        prevCell = null;
        figureLen = 1;
        continue;
      }
      if (prevCell == null) {
        prevCell = grid[r][c].src;
        figureStart = r;
        figureLen = 1;
        figureStop = null;
        continue;
      }
      else {
        var curCell = grid[r][c].src;
        if (!(prevCell == curCell)) {
          prevCell = grid[r][c].src;
          figureStart = r;
          figureStop = null;
          figureLen = 1;
          continue;
        } else {
            figureLen += 1;
            if (figureLen == 3) {
              validFigures += 1;
              score += 10;
              $("#score-text").html(score);
              figureStop = r;
              for (var ci = figureStart; ci <= figureStop; ci++) {
                grid[ci][c].isInCombo = true;
                grid[ci][c].src = null;
              }
              prevCell = null;
              figureStart = null;
              figureStop = null;
              figureLen = 1;
              continue;
            }
          }
        }
      }
    }// destruir combos
   var isCombo = false;
   for (var r = 0; r < rows; r++)
    for (var c = 0; c < cols; c++)
      if (grid[r][c].isInCombo)
      {
        isCombo = true;
        reponerDulces();
      }
  if (isCombo) {
    desaparecerCombos();
    reponerDulces();
  }
}

function desaparecerCombos() {
  for (var r = 0; r < rows; r++)  {
   for (var c = 0; c < cols; c++) {
     if (grid[r][c].isInCombo) {
       // celda vacia
       grid[r][c].o.addClass('highlight', function() {
         $(this).animate({
           opacity: 0
         });
       });
     }
   }
 }
}

function reponerDulces() {
    // mover celdas vacias hacia arriba
   for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (grid[r][c].isInCombo) {
        // celda vacia
        grid[r][c].o.attr("src","");
        // deshabilitar cerlda del combo
        grid[r][c].isInCombo=false;

        for (var sr = r; sr >= 0; sr--) {
          if (sr == 0) break;
          if (grid[sr-1][c].locked) break;
          var tmp = grid[sr][c].src;
          grid[sr][c].src = grid[sr-1][c].src;
          grid[sr-1][c].src = tmp;
        }
      }
    }
  }

    // reordenando y reponiendo celdas
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        grid[r][c].o.attr("src",grid[r][c].src);
        grid[r][c].o.addClass('drop', {direction: 'down'}, function(){
          $(this).animate({
            opacity: 1
          })
        });
        grid[r][c].isInCombo = false;
        if (grid[r][c].src == null)
          grid[r][c].respawn = true;
        if (grid[r][c].respawn == true) {
          grid[r][c].o.off("ui-draggable-handle");
          grid[r][c].o.off("ui-droppable");
          grid[r][c].o.off("ui-draggable");
          grid[r][c].respawn = false; // repuesto!
          grid[r][c].src = generarDulce();
          grid[r][c].locked = false;
          grid[r][c].o.attr("src",grid[r][c].src);
          grid[r][c].o.attr("ui-draggable");
          grid[r][c].o.attr("ui-droppable");
          grid[r][c].o.attr("ui-draggable-handle");
        }
      }
    }
    // revisar si hay combos pendientes despues de reordenar
    destruirCombos();
}

//<<<----------------------------INICIO y FIN----------------------------->>>//

function finJuego() {
    $(".panel-tablero").animate(
      {
        width: "0%",
        border: "0px hidden"
      }, 1000, function() {
        $(this).hide()
    });
    $(".panel-score").animate(
      {
        width: "95%"
      }, 1000, function() {
        $(".score").before("<h2 class='titulo-over'>Juego Terminado</h2>");
      }
    );
    $(".time").animate(
      {
        width: "0%",
        border: "0px hidden"
      }, 1000, function() {
        $(this).hide()
    });
  }

$(function(){
  vecesClick = 0;
  movimientos = 0;

  $(".btn-reinicio").click(function() {
    vecesClick++;
    if (vecesClick==1) {
      $('div.panel-tablero > div').css('justify-content', 'space-around')
      $(this).text("Reiniciar");
      timerUp();
      setTimeout(function() {
        $(".dulce").show("blind", "slow" )
      }, 150);
      setTimeout(function() {
        destruirCombos();
      }, 250);
    } else if (vecesClick==2) {
      location.reload()
    }
  })
})

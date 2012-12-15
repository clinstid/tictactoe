// The board is going to look like this, with the squares as numbered:
//
//    |   |
//  0 | 1 | 2
// -----------
//    |   |
//  3 | 4 | 5
// -----------
//  6 | 7 | 8
//    |   |

// Our canvas that we're drawing on and an eventual context to use for it
var canvas;
var context;

// Our message box's location. The y coordinate for the box is going to be
// updated once we get our canvas's dimensions.
var message_x = 5;
var message_y = 480;
var message_height = 50;
var message_font_size = 12;

// The width to use for the lines on the board
var board_line_width = 2;

var vert_left_start_x = 0;
var vert_left_start_y = 0;

var vert_left_end_x = 0;
var vert_left_end_y = 0;

var vert_right_start_x = 0;
var vert_right_start_y = 0;

var vert_right_end_x = 0;
var vert_right_end_y = 0;

var horiz_top_start_x = 0;
var horiz_top_start_y = 0;

var horiz_top_end_x = 0;
var horiz_top_end_y = 0;

var horiz_bottom_start_x = 0;
var horiz_bottom_start_y = 0;

var horiz_bottom_end_x = 0;
var horiz_bottom_end_y = 0;

var click_count = 0;

var squares = new Array();

function Square(start_x, start_y, end_x, end_y)
{
    var SQUARE_EMPTY = 0;
    var SQUARE_X = 1;
    var SQUARE_O = 2;

    this.start_x = start_x;
    this.start_y = start_y;
    this.end_x = end_x;
    this.end_y = end_y;
    this.contains = SQUARE_EMPTY;

}

Square.prototype.within = function(x, y, border_width)
{
    if (x > (this.start_x + border_width) && x < (this.end_x - border_width) &&
        y > (this.start_y + border_width) && y < (this.end_y - border_width))
    {
        return true;
    }
    else
    {
        return false;
    }
}


function draw_board(name) 
{
    canvas = document.getElementById(name);

    message_y = canvas.height - message_font_size;

    // Check the element is in the DOM and the browser supports canvas
    if(canvas.getContext) 
    {
        // Initialize a 2-dimensional drawing context
        context = canvas.getContext('2d');

        canvas.addEventListener('mousemove', track_mouse, false);
        canvas.addEventListener('mousedown', mouse_click, false);

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the board:
        //
        // 0,0    x/3,0 2x/3,0 x,0
        //           |      |
        //         0 |  1   | 2
        // 0,y/3  -------------- x,y/3
        //           |      |
        //         3 |  4   | 5
        // 0,2y/3 -------------- x,2y/3
        //         6 |  7   | 8
        //           |      |
        // 0,y    x/3,y 2x/3,y x,y
        //

        x = canvas.width;
        y = canvas.height - message_height;

        console.log("message_height %d", message_height);

        squares[0] = new Square(0, 0, x/3, y/3);
        squares[1] = new Square(x/3, 0, 2*x/3, y/3);
        squares[2] = new Square(2*x/3, 0, x, y/3);

        squares[3] = new Square(0, y/3, x/3, 2*y/3);
        squares[4] = new Square(x/3, y/3, 2*x/3, 2*y/3);
        squares[5] = new Square(2*x/3, y/3, x, 2*y/3);

        squares[6] = new Square(0, 2*y/3, x/3, y);
        squares[7] = new Square(x/3, 2*y/3, 2*x/3, y);
        squares[8] = new Square(2*x/3, 2*y/3, x, y);

        // left vertical line
        draw_line(squares[1].start_x, squares[1].start_y,
                  squares[6].end_x, squares[6].end_y);

        // right vertical line
        draw_line(squares[2].start_x, squares[2].start_y,
                  squares[7].end_x, squares[7].end_y);

        // top horizontal line
        draw_line(squares[3].start_x, squares[3].start_y,
                  squares[2].end_x, squares[2].end_y);

        // bottom horizontal line
        draw_line(squares[6].start_x, squares[6].start_y,
                  squares[5].end_x, squares[5].end_y);

        spacing = 5;

        // draw_x(spacing,
        //        spacing,
        //        vert_left_start_x - spacing,
        //        horiz_top_start_y - spacing);

        // draw_o(spacing,
        //        spacing,
        //        vert_left_start_x - spacing,
        //        horiz_top_start_y - spacing);

        write_message("Would you like to play a game?");
    }
}

function draw_line(start_x, start_y, end_x, end_y) 
{
        context.strokeStyle = "gray";
        context.lineWidth = board_line_width;

        context.beginPath();
        context.moveTo(start_x, start_y);
        context.lineTo(end_x, end_y);
        context.closePath();
        context.stroke();
}

function draw_x(start_x, start_y, end_x, end_y) 
{
        context.strokeStyle = "#000000";
        context.lineWidth = 3;

        context.beginPath();
        context.moveTo(start_x, start_y);
        context.lineTo(end_x, end_y);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.moveTo(start_x, end_y);
        context.lineTo(end_x, start_y);
        context.closePath();
        context.stroke();
}

function draw_o(start_x, start_y, end_x, end_y) 
{
        context.strokeStyle = "#000000";
        context.lineWidth = 3;

        context.beginPath();
        context.arc(start_x + end_x / 2, 
                    start_y + end_y / 2,
                    (end_x - start_x) / 2 - spacing,
                    0,
                    Math.PI * 2,
                    false);
        context.closePath();
        context.stroke();
}

function write_message(message) 
{
    context.clearRect(message_x, message_y, canvas.width, canvas.height);
    context.font = "12pt Monospace";
    context.fillStyle = "black";
    context.fillText(message, message_x, message_y);
}

function track_mouse(event) 
{
    var rect = canvas.getBoundingClientRect();
    //console.log("Mouse position: %d,%d", 
    //            event.clientX - rect.left, 
    //            event.clientY - rect.top);

}

function mouse_click(event) 
{
    click_count += 1;
    console.log("Mouse click: %d,%d #%d",
                event.x - canvas.offsetLeft,
                event.y - canvas.offsetTop,
                click_count);
}


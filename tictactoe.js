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

// The width to use for drawing the X and O
var piece_line_width = 3;

// The space to leave between X/O and the border of the board
var square_spacing = 3;

var click_count = 0;

var squares = new Array();

function Square(start_x, start_y, end_x, end_y)
{
    var SQUARE_EMPTY = 0;
    var SQUARE_X = 1;
    var SQUARE_O = 2;

    this.start_x = parseInt(start_x);
    this.start_y = parseInt(start_y);
    this.end_x = parseInt(end_x);
    this.end_y = parseInt(end_y);
    this.contains = SQUARE_EMPTY;

}

Square.prototype.within = function(x, y, border_width)
{
    // console.log("Testing if click is within square: %d [ %d ] %d, %d [ %d ] %d",
    //             this.start_x, x, this.end_x, this.start_y, y, this.end_y);
    if (x > (this.start_x + border_width) && 
        x < (this.end_x - border_width) &&
        y > (this.start_y + border_width) && 
        y < (this.end_y - border_width))
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

function draw_x(square) 
{
    console.log("draw_x: %d, %d to %d, %d", 
                square.start_x, square.start_y,
                square.end_x, square.end_y);

    context.strokeStyle = "#000000";
    context.lineWidth = piece_line_width;

    context.beginPath();
    context.moveTo(square.start_x + square_spacing, 
                   square.start_y + square_spacing);
    context.lineTo(square.end_x - square_spacing, 
                   square.end_y - square_spacing);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(square.start_x + square_spacing, 
                   square.end_y - square_spacing);
    context.lineTo(square.end_x - square_spacing, 
                   square.start_y + square_spacing);
    context.closePath();
    context.stroke();
}

function draw_o(start_x, start_y, end_x, end_y) 
{
        context.strokeStyle = "#000000";
        context.lineWidth = piece_line_width;

        context.beginPath();
        context.arc(start_x + end_x / 2, 
                    start_y + end_y / 2,
                    (end_x - start_x) / 2 - piece_line_width,
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
    console.log("mouse_click() called");
    click_count += 1;

    var click_x = event.x - canvas.offsetLeft;
    var click_y = event.y - canvas.offsetTop;

    // Calculate which square we're in.
    var row = parseInt(click_x / (x / 3));
    var column = parseInt(click_y / (y / 3));
    var square_number = row + (column * 3);
    console.log("calculated square number is %d", square_number);

    // Make sure that the click wasn't on a border.
    if (squares[square_number].within(click_x, click_y, board_line_width))
    {
        draw_x(squares[square_number]);
    }
}


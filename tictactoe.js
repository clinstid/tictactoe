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

// The coordinates of the board
var board_start_x = 0;
var board_start_y = 0;
var board_end_x = 0;
var board_end_y = 0;

// Our message box's location. The y coordinate for the box is going to be
// updated once we get our canvas's dimensions.
var message_start_x = 5;
var message_start_y = 480;
var message_height = 50;
var message_font_size = 12;

// The width to use for the lines on the board
var board_line_width = 3;

// The width to use for drawing the X and O
var piece_line_width = 3;

// The space to leave between X/O and the border of the board
var square_spacing = 3;

var squares = new Array();

var win_table = [ [ [1, 2], [3, 6], [4, 8] ],
                  [ [0, 2], [4, 7] ],
                  [ [0, 1], [4, 6], [5, 8] ],
                  [ [0, 6], [4, 5] ],
                  [ [0, 8], [1, 7], [2, 6], [3, 5] ],
                  [ [2, 8], [3, 4] ],
                  [ [0, 3], [2, 4], [7, 8] ],
                  [ [1, 4], [6, 8] ],
                  [ [0, 4], [2, 5], [6, 7] ] ];

function Square(start_x, start_y, end_x, end_y)
{

    this.start_x = parseInt(start_x);
    this.start_y = parseInt(start_y);
    this.end_x = parseInt(end_x);
    this.end_y = parseInt(end_y);
    this.value = Square.SQUARE_EMPTY;
    this.highlighted = false;
}

Square.NO_SQUARE = -1;
Square.SQUARE_EMPTY = 0;
Square.SQUARE_X = 1;
Square.SQUARE_O = 2;
Square.MIN_SQUARE_NUMBER = 0;
Square.MAX_SQUARE_NUMBER = 8;

MAX_PLAY_COUNT = 9;

// Game state
var last_square_number = Square.NO_SQUARE;
var last_square_played = Square.SQUARE_EMPTY;
var game_over = false;
var play_count = 0;

Square.get_square_number = function(mouse_x, mouse_y)
{
    if (mouse_x < board_start_x || mouse_x > board_end_x ||
        mouse_y < board_start_y || mouse_y > board_end_y)
    {
        return Square.NO_SQUARE;
    }

    // Calculate which square we're in.
    var column = parseInt(mouse_x / ((board_end_x - board_start_x) / 3));
    var row = parseInt(mouse_y / ((board_end_y - board_start_y) / 3));
    var square_number = column + (row * 3);
    // console.log("calculated square number is %d", square_number);

    if (square_number < Square.MIN_SQUARE_NUMBER ||
        square_number > Square.MAX_SQUARE_NUMBER)
    {
        return Square.NO_SQUARE;
    }

    // Make sure that the mouse wasn't on a border.
    if (squares[square_number].within(mouse_x, mouse_y, board_line_width))
    {
        return square_number;
    }
    else
    {
        return Square.NO_SQUARE;
    }
}

Square.prototype.highlight = function()
{
    context.lineWdith = 0;
    this.highlighted = true;
    context.fillStyle = "lightblue";
    context.fillRect(this.start_x + board_line_width,
                     this.start_y + board_line_width, 
                     this.end_x - this.start_x - 2*board_line_width,
                     this.end_y - this.start_y - 2*board_line_width);
}

Square.prototype.clear = function()
{
    context.lineWdith = 0;
    this.highlighted = false;
    context.clearRect(this.start_x + board_line_width,
                      this.start_y + board_line_width, 
                      this.end_x - this.start_x - 2*board_line_width,
                      this.end_y - this.start_y - 2*board_line_width);
}

Square.prototype.draw_x = function() 
{
    // console.log("draw_x: %d, %d to %d, %d", 
    //             this.start_x, this.start_y,
    //             this.end_x, this.end_y);

    this.clear();

    context.strokeStyle = "black";
    context.lineWidth = piece_line_width;

    context.beginPath();
    context.moveTo(this.start_x + square_spacing, 
                   this.start_y + square_spacing);
    context.lineTo(this.end_x - square_spacing, 
                   this.end_y - square_spacing);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(this.start_x + square_spacing, 
                   this.end_y - square_spacing);
    context.lineTo(this.end_x - square_spacing, 
                   this.start_y + square_spacing);
    context.closePath();
    context.stroke();

    this.value = Square.SQUARE_X;
}

Square.prototype.draw_o = function () 
{
    context.strokeStyle = "black";
    context.lineWidth = piece_line_width;

    this.clear();

    context.beginPath();
    // console.log("Drawing O - x:%d, y:%d, radius:%d, startAngle:%f, endAngle:%f",
    //             (this.start_x + this.end_x) / 2, 
    //             (this.start_y + this.end_y) / 2,
    //             (this.end_x - this.start_x) / 2 - piece_line_width,
    //             0,
    //             Math.PI * 2);
    context.arc((this.start_x + this.end_x) / 2, 
                (this.start_y + this.end_y) / 2,
                (this.end_x - this.start_x) / 2 - piece_line_width,
                0,
                Math.PI * 2,
                false);
    context.closePath();
    context.stroke();

    this.value = Square.SQUARE_O;
}
Square.prototype.within = function(x, y)
{
    // console.log("Testing if click is within square: %d [ %d ] %d, %d [ %d ] %d",
    //             this.start_x, x, this.end_x, this.start_y, y, this.end_y);
    if (x > (this.start_x + board_line_width) && 
        x < (this.end_x - board_line_width) &&
        y > (this.start_y + board_line_width) && 
        y < (this.end_y - board_line_width))
    {
        return true;
    }
    else
    {
        return false;
    }
}

Square.prototype.empty = function()
{
    if (this.value == Square.SQUARE_EMPTY)
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

    message_start_y = canvas.height - message_height;

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

        board_start_x = 0;
        board_start_y = 0;
        board_end_x = canvas.width;
        board_end_y = canvas.height - message_height;

        squares[0] = new Square(board_start_x, board_start_y, board_end_x/3, board_end_y/3);
        squares[1] = new Square(board_end_x/3, board_start_y, 2*board_end_x/3, board_end_y/3);
        squares[2] = new Square(2*board_end_x/3, board_start_y, board_end_x, board_end_y/3);

        squares[3] = new Square(board_start_x, board_end_y/3, board_end_x/3, 2*board_end_y/3);
        squares[4] = new Square(board_end_x/3, board_end_y/3, 2*board_end_x/3, 2*board_end_y/3);
        squares[5] = new Square(2*board_end_x/3, board_end_y/3, board_end_x, 2*board_end_y/3);

        squares[6] = new Square(board_start_x, 2*board_end_y/3, board_end_x/3, board_end_y);
        squares[7] = new Square(board_end_x/3, 2*board_end_y/3, 2*board_end_x/3, board_end_y);
        squares[8] = new Square(2*board_end_x/3, 2*board_end_y/3, board_end_x, board_end_y);

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


function write_message(message) 
{
    context.clearRect(message_start_x, message_start_y, 
                      canvas.width - message_start_x, canvas.height - message_start_y);
    context.font = message_font_size + "pt Monospace";
    context.fillStyle = "black";
    context.fillText(message, message_start_x, canvas.height-5);
}

function track_mouse(event) 
{
    var rect = canvas.getBoundingClientRect();
    var mouse_x = event.clientX - rect.left;
    var mouse_y = event.clientY - rect.top;

    var square_number = Square.get_square_number(mouse_x, mouse_y);

    if (game_over)
    {
        return;
    }

    if (square_number == last_square_number)
    {
        return;
    }
    else if (square_number != Square.NO_SQUARE)
    {
        //console.log("track_mouse: square_number is %d", square_number);
        if (squares[square_number].empty())
        {
            squares[square_number].highlight();
        }
        
        if (last_square_number != Square.NO_SQUARE && 
            squares[last_square_number].empty())
        {
            // console.log("Mouse exit from square %d, clearing", last_square_number);
            squares[last_square_number].clear();
        }

        last_square_number = square_number;
    }
    else if (last_square_number != Square.NO_SQUARE &&
             squares[last_square_number].empty())
    {
        squares[last_square_number].clear();
        last_square_number = Square.NO_SQUARE;
    }

    //console.log("Mouse position: %d,%d", 
    //            event.clientX - rect.left, 
    //            event.clientY - rect.top);

}

function mouse_click(event) 
{
    var click_x = event.clientX - canvas.offsetLeft;
    var click_y = event.clientY - canvas.offsetTop;

    var square_number = Square.get_square_number(click_x, click_y);

    if (square_number != Square.NO_SQUARE)
    {
        play(square_number);
    }
}

function log_squares()
{
    console.log("-----------------");
    console.log("Row 1: 0:%d 1:%d 2:%d", squares[0].value, squares[1].value, squares[2].value);
    console.log("Row 2: 3:%d 4:%d 5:%d", squares[3].value, squares[4].value, squares[5].value);
    console.log("Row 3: 6:%d 7:%d 8:%d", squares[6].value, squares[7].value, squares[8].value);
    console.log("-----------------");
}

function check_for_winner(square_number)
{
    var my_win_table = win_table[square_number];

    for (var i = 0; i < my_win_table.length; i++)
    {
        var winner = squares[square_number].value;
        var pair = my_win_table[i];
        for (var j = 0; j < pair.length; j++)
        {
            var neighbor_square = pair[j];
            // log_squares();
            // console.log("winner = %d, value(%d) = %d", winner, neighbor_square, squares[neighbor_square].value);
            if (squares[neighbor_square].value != winner)
            {
                winner = Square.SQUARE_EMPTY;
                break;
            }
        }

        if (winner != Square.SQUARE_EMPTY)
        {
            break;
        }
    }

    return winner;
}

function play(square_number)
{
    if (game_over)
    {
        return;
    }

    if (squares[square_number].empty())
    {
        if (last_square_played == Square.SQUARE_X)
        {
            squares[square_number].draw_o();
            last_square_played = Square.SQUARE_O;
        }
        else
        {
            squares[square_number].draw_x();
            last_square_played = Square.SQUARE_X;
        }

        check_for_last_move(square_number);
    }
}

function check_for_last_move(square_number)
{
    play_count += 1;

    var winner = check_for_winner(square_number);
    // console.log("winner = %d", winner);

    if (winner == Square.SQUARE_EMPTY && play_count >= MAX_PLAY_COUNT)
    {
        write_message("DRAW!");
        game_over = true;
        return;
    }

    if (winner == Square.SQUARE_X)
    {
        write_message("X WINS!");
        game_over = true;
    }
    else if (winner == Square.SQUARE_O)
    {
        write_message("O WINS!");
        game_over = true;
    }
}

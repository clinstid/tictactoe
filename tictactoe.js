var canvas;
var context;

var message_x = 5;

// The y coordinate of the message is going to change, but we'll start with a
// reasonable default value.
var message_y = 480;
var message_y_offset = 20;

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

var SQUARE_EMPTY = 0;
var SQUARE_X = 1;
var SQUARE_O = 2;

function draw_board(name) {
    canvas = document.getElementById(name);

    message_y = canvas.height - message_y_offset;

    // Check the element is in the DOM and the browser supports canvas
    if(canvas.getContext) {
        // Initialize a 2-dimensional drawing context
        context = canvas.getContext('2d');

        canvas.addEventListener('mousemove', track_mouse, false);
        canvas.addEventListener('mousedown', mouse_click, false);

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the board:
        //
        // 0,0    x/3,0 2x/3,0 x,0
        //           |      |
        //           |      |
        // 0,y/3  -------------- x,y/3
        //           |      |
        //           |      |
        // 0,2y/3 -------------- x,2y/3
        //           |      |
        //           |      |
        // 0,y    x/3,y 2x/3,y x,y
        //

        x = canvas.width;
        y = canvas.height - 100;

        vert_left_start_x = x / 3;
        vert_left_start_y = 0;

        vert_left_end_x = vert_left_start_x;
        vert_left_end_y = y;

        vert_right_start_x = 2 * x / 3;
        vert_right_start_y = 0;

        vert_right_end_x = vert_right_start_x;
        vert_right_end_y = y;

        horiz_top_start_x = 0;
        horiz_top_start_y = y / 3;

        horiz_top_end_x = x;
        horiz_top_end_y = horiz_top_start_y;

        horiz_bottom_start_x = 0;
        horiz_bottom_start_y = 2 * y / 3;

        horiz_bottom_end_x = x;
        horiz_bottom_end_y = horiz_bottom_start_y;

        // left vertical line
        draw_line(vert_left_start_x, 
                  vert_left_start_y,
                  vert_left_end_x,
                  vert_left_end_y);

        // right vertical line
        draw_line(vert_right_start_x, 
                  vert_right_start_y,
                  vert_right_end_x,
                  vert_right_end_y);

        // top horizontal line
        draw_line(horiz_top_start_x, 
                  horiz_top_start_y,
                  horiz_top_end_x,
                  horiz_top_end_y);

        // bottom horizontal line
        draw_line(horiz_bottom_start_x, 
                  horiz_bottom_start_y,
                  horiz_bottom_end_x,
                  horiz_bottom_end_y);

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

function draw_line(start_x, start_y, end_x, end_y) {
        context.strokeStyle = "gray";
        context.lineWidth = board_line_width;

        context.beginPath();
        context.moveTo(start_x, start_y);
        context.lineTo(end_x, end_y);
        context.closePath();
        context.stroke();
}

function draw_x(start_x, start_y, end_x, end_y) {
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

function draw_o(start_x, start_y, end_x, end_y) {
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

function write_message(message) {
    context.clearRect(message_x, message_y, canvas.width, canvas.height);
    context.font = "12pt Monospace";
    context.fillStyle = "black";
    context.fillText(message, message_x, message_y);
}

function track_mouse(event) {
    var rect = canvas.getBoundingClientRect();
    //console.log("Mouse position: %d,%d", 
    //            event.clientX - rect.left, 
    //            event.clientY - rect.top);

}

function mouse_click(event) {
    click_count += 1;
    console.log("Mouse click: %d,%d #%d",
                event.x - canvas.offsetLeft,
                event.y - canvas.offsetTop,
                click_count);
}


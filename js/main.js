let snake;
let x, y
const row = 20;
const col = 25;
let way = 0;
let level
let score = 0
let isLeft = false
let isRight = false
let isUp = true; // ban đầu con rắn đang đi lên
let isDown = false
// thức ăn
let x_food, y_food
let isEat = true
// boom
let x_boom, y_boom
let isPutBoom = false
// nấm độc
let isPutMushroom = false;// bien ktra xem da ve nam chua
let isToxic = false;// bien ktra xem da bi dinh doc chua
let timeInitToxic // thời gian khởi tạo lại nấm độc
let timeToxic // thời gian rắn bị dính độc
let playing; // bien dieu khien tro choi(di chuyen, ktra va cham) => muc dich tang toc do di chuyen, toc do cap nhat (dung o lv5 va lv6)
let drawing; // thoi gian ve(boom, food, mushroom, giao dien)
// đặt thời gian chạy cho hàm interval
// Lấy phần tử modal
// Khai báo biến timeInterval và gán giá trị mặc định
let timeInterval = 150;
let snakeColor = '#ffffff';

//*LĨNH BEGIN
// Lấy phần tử modal
var modal = document.getElementById("configModal");

var modal1 = document.getElementById("configModal1");

// Lấy phần tử điều khiển tỷ lệ
var scaleControl = document.getElementById("scaleControl");

// Lấy phần tử button mở modal
var btn = document.getElementById("setting");

// Lấy phần tử button mở modal
var btn1 = document.getElementById("setting1");

var btnContinue = document.getElementById("btnPlayContinue");
var btnClose = document.getElementById("btnClose");
var btnReplay = document.getElementById("btnReplay");

// Lấy phần tử <span> đóng modal
var span = document.getElementsByClassName("close")[0];

// Lấy phần tử âm thanh
var sound = document.getElementById("buttonSound");

// Lấy phần tử điều khiển âm lượng
var volumeControl = document.getElementById("volumeControl");

// Lấy phần tử điều khiển tốc độ
var speedControl = document.getElementById("speedControl");

// Lấy phần tử điều khiển màu sắc
var colorControl = document.getElementById("colorControl");

// Lấy phần tử hiển thị mã màu
var selectedColor = document.getElementById("selectedColor");


// Khi người dùng nhấn vào nút, mở modal và phát âm thanh
btn.onclick = function() {
    modal.style.display = "block";
    sound.play();
}




// Khi người dùng nhấn vào bất cứ đâu bên ngoài modal, đóng modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Khi người dùng thay đổi giá trị thanh trượt âm lượng
volumeControl.oninput = function() {
    sound.volume = volumeControl.value;
    localStorage.setItem('volume', volumeControl.value); // Lưu giá trị âm lượng ngay lập tức
}

// Khi người dùng thay đổi giá trị thanh trượt tốc độ
speedControl.oninput = function() {
    timeInterval = speedControl.value;
    localStorage.setItem('timeInterval', speedControl.value); // Lưu giá trị tốc độ ngay lập tức
}

// Khi người dùng thay đổi giá trị bộ chọn màu
colorControl.oninput = function() {
    snakeColor = colorControl.value;
    selectedColor.textContent = 'Màu đã chọn: ' + colorControl.value; // Hiển thị mã màu đã chọn
    localStorage.setItem('snakeColor', colorControl.value); // Lưu giá trị màu sắc ngay lập tức

// Cập nhật màu sắc cho các ô của rắn
    $('.cell.snake').css('background-color', snakeColor);
}

scaleControl.oninput = function() {
    scale = parseFloat(scaleControl.value);
    localStorage.setItem('scale', scaleControl.value); // Lưu giá trị tỷ lệ ngay lập tức
    $('#gameBoard').css('transform', `scale(${scale})`); // Cập nhật tỷ lệ cho bảng
}

window.onload = function() {
    var savedVolume = localStorage.getItem('volume');
    var savedSpeed = localStorage.getItem('timeInterval');
    var savedColor = localStorage.getItem('snakeColor');

    if (savedVolume !== null) {
        volumeControl.value = savedVolume;
        sound.volume = savedVolume;
    } else {
        volumeControl.value = 1; // Giá trị mặc định nếu chưa có cấu hình lưu
        sound.volume = 1;
    }

    if (savedSpeed !== null) {
        speedControl.value = savedSpeed;
        timeInterval = savedSpeed;
    } else {
        speedControl.value = 150; // Giá trị mặc định nếu chưa có cấu hình lưu
        timeInterval = 150;
    }

    if (savedColor !== null) {
        colorControl.value = savedColor;
        snakeColor = savedColor;
        selectedColor.textContent = 'Màu đã chọn: ' + savedColor;

        // Cập nhật màu sắc cho các ô của rắn khi tải trang
        $('.cell.snake').css('background-color', savedColor);
    } else {
        colorControl.value = '#518111'; // Giá trị mặc định nếu chưa có cấu hình lưu
        snakeColor = '#518111';
        selectedColor.textContent = 'Màu đã chọn: #518111';

        // Cập nhật màu sắc cho các ô của rắn khi tải trang
        $('.cell.snake').css('background-color', '#518111');
    }
}
//*LĨNH END

// xóa tất cả rắn , tường , thức ăn, nấm và boom nếu có
function clearAll() {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            $('.cell' + '-' + i + '-' + j).removeClass('mushroom');
            $('.cell' + '-' + i + '-' + j).removeClass('bg-danger');
            $('.cell' + '-' + i + '-' + j).removeClass('bg-dark').css('background-color', snakeColor);
            $('.cell' + '-' + i + '-' + j).removeClass('bg-success');
            $('.cell' + '-' + i + '-' + j).removeClass('apple');
            $('.cell' + '-' + i + '-' + j).removeClass('boom');
            $('.cell' + '-' + i + '-' + j).removeClass('bg-secondary');
        }
    }
}

// xóa tất cả Interval
function clearIntervals() {
    clearInterval(drawing);
    clearInterval(playing);
    // nếu hai hàm này tồn tại mới xóa
    if (typeof (drawingBoss) == 'number' && typeof (runningBoss) == 'number') {
        clearInterval(drawingBoss);
        clearInterval(runningBoss);
    }
}

// xóa 2 hàm khởi tạo nấm và thời gian bị nhiễm độc ở level 4,5
function clearTimeouts() {
    clearTimeout(timeToxic)
    clearTimeout(timeInitToxic)
}

// reset tất cả về trạng thái ban đầu
function resetValue() {
    way = 0
    score = 0
    isEat = true
    isPutBoom = false
    isLeft = false
    isRight = false
    isUp = true; // ban đầu con rắn đang đi lên
    isDown = false
    isPutMushroom = false
    isToxic = false
    $('#level').prop('disabled', false);
    // ẩn đi chữ game over và win game
    $('.gameover , .win').css({
        'visibility': 'hidden'
    });
    $('#play').text('Bắt đầu');
}


$(document).ready(function () {

    // ẩn alert thông báo chưa chọn level
    $('.alert-danger').hide(100);
    // CLICK BẮT ĐẦU
    $('#play').click(function() {
        // xóa hết các hàm reset lại các giá trị về ban
        resetValue()
        clearTimeouts()
        clearAll()
        level = $('#level').val();

        if (level >= 1) { // nếu đã chọn level
            // khóa nút chọn level và bắt đầu
            $('#level').prop('disabled', true);
            $('#play').prop('disabled', true);
            // ẩn chữ SNAKE
            $('.welcome').hide(100)

            initSnake(level)
        } else {
            // hiện alert chưa chọn level sau 3s thì ẩn đi
            $('.alert-lv').slideDown();
            setTimeout(() => {
                $('.alert-lv').slideUp();
            }, 3000);
        }
    });
    // CLICK CHƠI MỚI
    $('#new').click(function () {
        // hiện chữ snake lời chào của game sau 0.1s
        $('.welcome').show(100)
        // reset lại các biến về giá trị ban đầu
        clearTimeouts()
        resetValue()
        $('#level').val("0").change()

        $('.score').html(`Điểm số: <strong>${score}</strong>`)
        // xóa các lớp trên màn hình và các interval đang chạy
        clearAll()
        clearIntervals()
    });

    for (let i = 0; i < row; i++) {
        r = $('<div>').addClass('row');
        for (let j = 0; j < col; j++) {
            cell = $('<div>').addClass('cell col border cell' + '-' + i + '-' + j);
            r.append(cell);
        }
        $('.game').append(r);
    }
})

// hàm run game
function run() {
    // xây tường từ lv2 trở lên
    drawWall()
    // xử lí phương hướng
    handleKeyDownEvent()
    // xử lí di chuyển của rắn
    handleSnakeMove()
    // tạo thức ăn
    initFood()
    // tạo boom từ lv3 trở lên
    initBoom()
    // kiểm tra xem thức ăn và boom có trùng với bức tường không
    checkStackUp()
    // kiểm tra xem thức ăn đã được ăn chưa
    checkEat()
    // nấm độc
    toxic()
    // kiểm tra xem có dính độc không
    $('.score').html(`Điểm số: <strong>${score}</strong>`)
    // cho phép rắn đi xuyên tường
    crossWall()
    //hàm kết thúc game
    gameOver()
    // hàm win game
    winGame()
}

// hàm khởi tạo con rắn
function initSnake(level) {
    // xóa đi các hàm intervals khi khởi tạo lại con rắn
    clearIntervals()
    if (level == 1) {
        // bắt đầu từ dòng 7 -> dòng 16 và từ cột 1 -> 23
        x = parseInt(Math.random() * 10) + 5;
        y = parseInt(Math.random() * 23) + 1;
        snake = [[x, y], [x + 1, y], [x + 2, y]];
        drawing = setInterval(drawSnake, timeInterval);
        playing = setInterval(run, timeInterval);
    }
    if (level == 2) {
                //  tránh không bắt đầu trên tường
                // bắt đầu từ dòng 7 -> dòng 16 và từ cột 1 -> 11
                x = parseInt(Math.random() * 10) + 7;
                y = parseInt(Math.random() * 11) + 1;

        snake = [[x, y], [x + 1, y], [x + 2, y]];
        drawing = setInterval(drawSnake, timeInterval);
        playing = setInterval(run, timeInterval);
    }
    if (level == 3) {
        //  tránh không bắt đầu trên tường
        // bắt đầu từ dòng 7 -> dòng 16 và từ cột 1 -> 11
        x = parseInt(Math.random() * 10) + 7;
        y = parseInt(Math.random() * 11) + 1;

        snake = [[x, y], [x + 1, y], [x + 2, y]];
        drawing = setInterval(drawSnake, timeInterval);
        playing = setInterval(run, timeInterval);
    }
}

//hàm vẽ con rắn
function drawSnake() {
    // xóa con rắn
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            $('.cell' + '-' + i + '-' + j).removeClass('bg-danger');
            $('.cell' + '-' + i + '-' + j).removeClass('bg-dark').css('background-color', snakeColor);
        }
    }
    // vẽ lại con rắn
    for (let i = 0; i < snake.length; i++) {
        draw(snake[i][0], snake[i][1]);
    }
}

function draw(x, y) {
    // vẽ đầu con rắn
    if (x === snake[0][0] && y === snake[0][1]) {
        $('.cell' + '-' + x + '-' + y).addClass('bg-danger');
    } else {
        // vẽ thân con rắn
        $('.cell' + '-' + x + '-' + y).addClass('bg-dark').css('background-color', snakeColor);
    }
}

//*LUÂN BEGIN
// hàm di chuyển
function handleSnakeMove() {
    // di chuyển con rắn
    // lấy cuối thêm đầu bằng hàm pop() để lấy ra vị trí cuối và unshift() để thêm vào đầu
    // cell[0] : truc y , cell[1] : truc x
    switch (way) {
        // lên: y giảm
        case 0:
            cell = snake.pop();
            cell[0] = snake[0][0] - 1;
            cell[1] = snake[0][1];
            snake.unshift(cell);

            break;
        // xuống: y tăng
        case 1:
            cell = snake.pop();
            cell[0] = snake[0][0] + 1;
            cell[1] = snake[0][1];
            snake.unshift(cell);
            break;
        // qua phải : x tăng
        case 2:
            cell = snake.pop();
            cell[0] = snake[0][0];
            cell[1] = snake[0][1] + 1;
            snake.unshift(cell);
            break;
        //qua trái : x giảm
        case 3:
            cell = snake.pop();
            cell[0] = snake[0][0];
            cell[1] = snake[0][1] - 1;
            snake.unshift(cell);
            break;
    }
}

// hàm điều khiển rắn
function handleKeyDownEvent() {

    // xử lí sự kiện nhấn phím
    // như đang chạy qua trái thì không được qua phải và lên xuống cũng tương tự
    onkeydown = function (key) {
        let direc = key.keyCode
        if (!isToxic) { // nếu không dính nấm độc thì di chuyển bình thường
            if ((direc == 37) && (!isRight)) {
                way = 3
                isLeft = true
                isUp = false
                isDown = false
            }
            if ((direc == 38) && (!isDown)) {
                way = 0
                isLeft = false
                isRight = false
                isUp = true
            }
            if ((direc == 39) && (!isLeft)) {
                way = 2
                isRight = true
                isUp = false
                isDown = false
            }
            if ((direc == 40) && (!isUp)) {
                way = 1
                isLeft = false
                isRight = false
                isDown = true
            }

        } else { // nếu bị dính nấm độc sẽ đi ngược hướng khi bấm. ví dụ nhấn trái sẽ qua phải, nhấn lên sẽ đi xuống
            if ((direc == 37) && (!isRight)) {
                way = 2
                isLeft = true
                isUp = false
                isDown = false
            }
            if ((direc == 38) && (!isDown)) {
                way = 1
                isLeft = false
                isRight = false
                isUp = true
            }
            if ((direc == 39) && (!isLeft)) {
                way = 3
                isRight = true
                isUp = false
                isDown = false
            }
            if ((direc == 40) && (!isUp)) {
                way = 0
                isLeft = false
                isRight = false
                isDown = true
            }
        }
    }
}
//*LUÂN END


//*TÂN BEGIN
// hàm rắn đi xuyên tường
function crossWall() {
    // xuyên tường bên trên thì đầu sẽ xuất hiện bên dưới và ngược lại
    if (cell[0] < 0) {
        cell[0] = row
    }
    if (cell[0] > row) {
        cell[0] = 0
    }
    //xuyên tường bên trái thì đầu sẽ xuất hiện bên phải và ngược lại
    if (cell[1] < 0) {
        cell[1] = col
    }
    if (cell[1] > col) {
        cell[1] = 0
    }
}
//*TÂN END

// hàm vẽ tường từ lv 2 trở lên
// i : hàng ngang
// j : hàng dọc
function drawWall() {
    if (level >= 2) {
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                //xây tường từ dòng 0 đến 6 và từ dòng 13 đến dòng 19  ở cột số 0
                if ((j === 0 && i < 7) || (j === 0 && i > 12)) {
                    $('.cell' + '-' + i + '-' + j).addClass('bg-success')
                }
                // xây hết hàng dọc số 0 , hàng dọc đầu tiên
                if (i === 0) {
                    $('.cell' + '-' + i + '-' + j).addClass('bg-success')
                }
                //xây tường từ dòng 0 đến 6 và từ dòng 13 đến dòng 19 ở cột số 24
                if ((j === 24 && i < 7) || (j === 24 && i > 12)) {
                    $('.cell' + '-' + i + '-' + j).addClass('bg-success')
                }
                // xây hết hàng dọc số 19 , hàng dọc cuối cùng
                if (i === 19) {
                    $('.cell' + '-' + i + '-' + j).addClass('bg-success')
                }
            }
        }
    }
}

//*TÂN BEGIN
// hàm kiểm tra rắn đã ăn quả táo chưa
function checkEat() {
    // nếu vị trí đầu của con rắn trùng với vị trí của quả táo
    // thì xóa class thức ăn và tăng chiều dài rắn
    if (snake[0][0] === x_food && snake[0][1] === y_food
        || $('.cell' + '-' + x_food + '-' + y_food).hasClass('bg-danger')) {
        $('.cell' + '-' + x_food + '-' + y_food).removeClass('apple');
        isEat = true
        // tăng kích thước và cộng điểm
        grown()
        score += 10
        // ăn 1 quả táo thêm boom ở lv 3 trở lên
        isPutBoom = false;
    }
}
//*TÂN END

//hàm khởi tạo quả táo
function initFood() {
    // khởi tạo thức ăn quả táo
    // nếu đã ăn thì sẽ random vị trí mới cho quả táo
    if (isEat && level == 1) {
        //random vị trí quả táo
        x_food = parseInt(Math.random() * 20);
        y_food = parseInt(Math.random() * 25);
        drawFood(x_food, y_food)

    }
    if (isEat && level >= 2) {
        x_food = parseInt(Math.random() * 18) + 1;
        y_food = parseInt(Math.random() * 23) + 1;
        //check tọa độ tường nếu trùng thì tăng thứ tự cột lên 1
        if (y_food == 12) {
            y_food += 1
        }
        drawFood(x_food, y_food);
    }
}

//hàm vẽ quả táo
    function drawFood(x, y) {
        $('.cell' + '-' + x + '-' + y).addClass('apple')
        // sau khi vẽ quả táo thì cho isEat thành false để không vẽ nữa ( 1 lần chỉ vẽ 1 quả táo)
        isEat = false
    }

// hàm khởi tạo boom ,level 3 trở lên mới đặt boom
    function initBoom() {
        // !isPutBoom là chưa đặt boom  !isPutBoom = true
        if ((level == 3 && !isPutBoom)) {
            // nếu điểm <= 30 thì đặt 1 lần 1 quả
            if (score <= 30) {
                x_boom = parseInt(Math.random() * 19) + 1;
                y_boom = parseInt(Math.random() * 23) + 1;
                drawBoom(x_boom, y_boom)
            }
            // ngược lại đặt từ 0 đến 2 quả
            else {
                for (let i = 0; i < 2; i++) {
                    x_boom = parseInt(Math.random() * 19) + 1;
                    y_boom = parseInt(Math.random() * 23) + 1;
                    drawBoom(x_boom, y_boom)
                }
            }
        }
    }

    function drawBoom(x, y) {
        $('.cell' + '-' + x + '-' + y).addClass('boom')
        // nếu lúc vẽ boom nằm trên đường con rắn đang đi thì vẽ lại quả boom
        if (x == snake[0][0] || y == snake[0][1]) {
            $('.cell' + '-' + x + '-' + y).removeClass('boom')
            isPutBoom = false
        }
        isPutBoom = true
    }

//*TÂN BEGIN
// hàm kiểm tra xem các vật trong game có bị chồng lên nhau không
    function checkStackUp() {
        // kiểm tra xem lúc khởi tạo quả táo hoặc boom hoặc nấm có trùng với tường không

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if ($('.cell' + '-' + i + '-' + j).hasClass('bg-success apple')) { // quả táo có nằm chồng lên tường không
                    $('.cell' + '-' + i + '-' + j).removeClass('apple')
                    isEat = true
                }
                if ($('.cell' + '-' + i + '-' + j).hasClass('bg-success boom')) {// boom có chồng lên tường không
                    $('.cell' + '-' + i + '-' + j).removeClass('boom')
                    isPutBoom = false
                }
                if ($('.cell' + '-' + i + '-' + j).hasClass('boom apple')) { //táo có chồng lên boom không
                    $('.cell' + '-' + i + '-' + j).removeClass('apple')
                    isEat = true
                    isPutBoom = false
                }
                if ($('.cell' + '-' + i + '-' + j).hasClass('bg-success mushroom')) { // nấm có ở chồng lên tường không
                    isPutMushroom = false
                }

            }

        }
    }
//*TÂN END
// hàm phát triển ( dài thêm )
    function grown() {
        // lấy vị trí cuối trừ vị trí kề cuối dể biết rắn đang nằm ngang hay dọc
        // nếu x = 0 thì rắn đang nằm ngang , y = 0 thì rắn đang nằm dọc
        // cộng vào cuối chuỗi của con rắn
        let x = snake[snake.length - 1][0] - snake[snake.length - 2][0]
        let y = snake[snake.length - 1][1] - snake[snake.length - 2][1]
        snake.push([x + snake[snake.length - 1][0], y + snake[snake.length - 1][1]])
    }

// hàm khởi tạo cho 2 con boss
    function initBoss() {
        // random vị trí cho 2 con boss
        x_boss1 = parseInt(Math.random() * 19) + 1; // xuất hiện trong khoảng dòng 1 -> 19
        y_boss1 = parseInt(Math.random() * 3) + 22; // xuất phát từ cột 22-> 24
        x_boss2 = parseInt(Math.random() * 19) + 1;
        y_boss2 = parseInt(Math.random() * 3) + 22;
        boss1 = [
            [x_boss1, y_boss1],
            [x_boss1, y_boss1 + 1],
            [x_boss1, y_boss1 + 2],
        ];
        boss2 = [
            [x_boss2, y_boss2],
            [x_boss2 + 1, y_boss2],
            [x_boss2 + 2, y_boss2],
        ];
        runningBoss = setInterval(runBoss, 170);
        drawingBoss = setInterval(drawBosses, 170);
    }

// vẽ 2 con boss
    function drawBosses() {
        // xóa đi để vẽ lại boss
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                $(".cell" + "-" + i + "-" + j).removeClass("bg-secondary");
            }
        }
        for (let i = 0; i < boss1.length; i++) {
            // vẽ 2 con boss
            drawBoss(boss1[i][0], boss1[i][1]);
            drawBoss(boss2[i][0], boss2[i][1]);
        }
    }

// vẽ boss
    function drawBoss(x, y) {
        $(".cell" + "-" + x + "-" + y).addClass("bg-secondary");
    }

// hàm di chuyển của 2 con boss
    function runBoss() {
        // cho 2 con boss máy chạy từ phải sang trái
        // lấy cuối thêm đầu(y nhu snake)
        cell = boss1.pop();
        cell[0] = boss1[0][0];
        cell[1] = boss1[0][1] - 1;
        boss1.unshift(cell);
        // boss dc di xuyen tuong
        crossWall();
        cell = boss2.pop();
        cell[0] = boss2[0][0];
        cell[1] = boss2[0][1] - 1;
        boss2.unshift(cell);
        crossWall();
    }

// nấm độc ở level 4 , 5
// ham ve nam
    function toxic() {

        if ((level == 4 || level == 5) && !isPutMushroom) {
            // xóa nấm cũ
            for (let i = 0; i < row; i++) {
                for (let j = 0; j < col; j++) {
                    $('.cell' + '-' + i + '-' + j).removeClass('mushroom');
                }
            }
            let x = parseInt(Math.random() * 19) + 1
            let y = parseInt(Math.random() * 23) + 1
            $(".cell" + "-" + x + "-" + y).addClass("mushroom");
            isPutMushroom = true;
            timeInterval = 170;
            // sau 5s đặt lại nấm mới
            timeInitToxic = setTimeout(() => {
                isPutMushroom = false;// để vẽ lại nấm
            }, 5000)
        }
        // goi lai ham ktra dinh doc lien quan den huong chay cua snake
        checkToxic();
    }


// kiểm tra dính độc
    function checkToxic() {
        // nếu dính độc là đầu rắn trùng với vị trí nấm
        if ($(".cell" + "-" + snake[0][0] + "-" + snake[0][1]).hasClass("mushroom")) {
            $(".cell" + "-" + snake[0][0] + "-" + snake[0][1]).removeClass('mushroom')
            isToxic = true
            // rắn bị dính độc đi ngược chiều với hướng di chuyển thông thường trong 3s
            timeToxic = setTimeout(() => {
                isToxic = false
            }, 3000)
        }
    }

// hàm điều kiện kết thúc game
    function gameOver() {
        // nếu đầu con rắn có tên class trùng tường hoặc boom hoặc thân hoặc boss thì game kết thúc
        if ($('.cell' + '-' + snake[0][0] + '-' + snake[0][1]).hasClass('bg-success') // bg tường
            || $('.cell' + '-' + snake[0][0] + '-' + snake[0][1]).hasClass('boom') // bg boom
            || $('.cell' + '-' + snake[0][0] + '-' + snake[0][1]).hasClass('bg-dark')// bg thân rắn
            || $('.cell' + '-' + snake[0][0] + '-' + snake[0][1]).hasClass('bg-secondary') // boss
        ) {
            // xóa tất cả các lớp vật thể trên màn hình
            clearAll()
            // hiện chữ game over
            $('.gameover').css({
                'left': '163px',
                'visibility': 'visible'
            })
            // nút 'bắt đầu' đổi thành 'chơi lại'
            $('#play').text('Chơi lại')
            // xóa tất cả các interval
            clearIntervals()
        }
    }

// hàm điều kiện win game
    function winGame() {
        // quy định điểm chiến thắng trò chơi theo level
        let victoryScore = 100;
        if (score == victoryScore) {

            let len = snake.length;
            // xóa đầu mảng của con rắn
            snake.shift()
            setTimeout(() => {
                    // xóa tất cả các lớp vật thể trên màn hình
                    clearAll()
                    $('.win').css({// hiện chữ win game
                        'left': '180px',
                        'visibility': 'visible',
                    })
                    $('#play').text('Chơi lại') //nút bắt đầu đổi thành nút chơi lại
                    // xóa tất cả các interval
                    clearIntervals()

                },
                // sau khoảng thời gian con rắn xóa từ đầu đến đuôi (snake.shift()) xong
                // 1 đốt rắn mất khoảng thời gian là :timeInterval (ms) để xóa
                len * timeInterval)
        }
    }

//*TÂM BEGIN
btn1.onclick = function() {
    clearIntervals();
    modal1.style.display = "block"
}

btnContinue.onclick = function (){
    modal1.style.display = "none"
    setInterval(drawSnake,timeInterval)
    setInterval(run,timeInterval)
}

btnClose.onclick = function (){
    modal1.style.display = "none"
    $('#btnClose').click(function () {
        // hiện chữ snake lời chào của game sau 0.1s
        $('.welcome').show(100)
        // reset lại các biến về giá trị ban đầu
        clearTimeouts()
        resetValue()
        $('#level').val("0").change()

        $('.score').html(`Điểm số: <strong>${score}</strong>`)
        // xóa các lớp trên màn hình và các interval đang chạy
        clearAll()
        clearIntervals()
    });
}

btnReplay.onclick = function (){
    modal1.style.display = "none"
    $('#btnReplay').click(function() {
        // xóa hết các hàm reset lại các giá trị về ban
        resetValue()
        clearTimeouts()
        clearAll()
        level = $('#level').val();

        if (level >= 1) { // nếu đã chọn level
            // khóa nút chọn level và bắt đầu
            $('#level').prop('disabled', true);
            $('#play').prop('disabled', true);
            // ẩn chữ SNAKE
            $('.welcome').hide(100)

            initSnake(level)
        } else {
            // hiện alert chưa chọn level sau 3s thì ẩn đi
            $('.alert-lv').slideDown();
            setTimeout(() => {
                $('.alert-lv').slideUp();
            }, 3000);
        }
    });
}
//*TÂM END
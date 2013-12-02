function bitcoinCharts() {
    var canvas = $('canvas')[0];
    var ctx = canvas.getContext('2d');
    var blocks = $('#chart').data('blocks').blocks;
    var chart_width = 900;
    var chart_height = 300;
    var time_offset;
    var time_scale;

    canvas.width = chart_width;
    canvas.height = chart_height;

    function updateCoords() {
        time_offset = blocks[blocks.length - 1].time;
        time_scale = blocks[0].time;

        _.each(blocks, function (block) {
            block.x = (block.time - time_offset) * (canvas.width / (blocks[0].time - time_offset));
            block.y = chart_height / 2;
            block.radius = 5;
        });
    }

    function drawPlotLine(i) {
        _.each(blocks, function (block) {
            ctx.beginPath();
            ctx.fillStyle = '#348EDA';
            ctx.strokeStyle = '#444';
            ctx.arc(block.x, block.y, block.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        });
    }

    function showBlockInfo (block) {
        $('.hash').html('Hash: ' + block.hash);
        $('.height').html('Height:' + block.height);
        $('.time').html('Time:' + new Date(block.time * 1000));
        $('.main_chain').html('Main Chain:' + block.main_chain);
    }

    function getPointsOnCircle(cx, cy, px, py) {
        return Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
    }

    $('canvas').on('mousedown', function (e) {
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;

        var grabbed_block = _.find(blocks, function (block) {
            var d = getPointsOnCircle(block.x, block.y, x, y);
            return d < block.radius;
        });

        if (grabbed_block) {
            showBlockInfo(grabbed_block);
        }
    });

    updateCoords();

    drawPlotLine(0);
}
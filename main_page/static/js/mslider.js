function getCurSlideId(cls_prefix, parent_id){
	return parseInt($('#' + parent_id).attr('class')
						.match(new RegExp(cls_prefix + '\\d*'))[0]
						.match(/\d*$/)[0]);
}
function isCurFirstSlide(cls_prefix, parent_id){
	var cur_slide = getCurSlideId(cls_prefix, parent_id)
	return cur_slide == 1;

}
function isCurLastSlide(cls_prefix, parent_id){
	var slides_cnt = $('#' + parent_id + '>.m-slide').length;
	var cur_slide = getCurSlideId(cls_prefix, parent_id)
	return cur_slide == slides_cnt;
}
function moveNextSlide(cls_prefix, parent_id) {
	if(isCurLastSlide(cls_prefix, parent_id)){
		moveToSlide(cls_prefix, parent_id, 1)
	}
	else{
		var cur_slide = getCurSlideId(cls_prefix, parent_id)
		moveToSlide(cls_prefix, parent_id, cur_slide + 1)
	}
}
function movePreSlide(cls_prefix, parent_id) {
	if(isCurFirstSlide(cls_prefix, parent_id)){
		var slides_cnt = $('#' + parent_id + '>.m-slide').length;
		moveToSlide(cls_prefix, parent_id, slides_cnt)
	}
	else{
		var cur_slide = getCurSlideId(cls_prefix, parent_id)
		moveToSlide(cls_prefix, parent_id, cur_slide - 1)
	}
}
function moveToSlide(cls_prefix, parent_id, target) {
	var cur_class = $('#' + parent_id).attr('class').match(new RegExp(cls_prefix + '\\d*'))[0]

	var slides_cnt = $('#' + parent_id + '>.m-slide').length;
	var target_translate = -1 / slides_cnt * (target - 1) * 100 + '%';

	$('#' + parent_id).css('transform', 'translate(' + target_translate + ',0)');
	$('#' + parent_id).removeClass(cur_class);
	$('#' + parent_id).addClass(cls_prefix + target);
}
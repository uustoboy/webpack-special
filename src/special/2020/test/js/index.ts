import '../css/index.scss';
import '../css/a.css';
import '../css/b.less';
import {indexClick} from './lib/a'
$(function(){
	$('.aaa').click(()=>{
		indexClick();
	});
});
#!/usr/bin/env node
/*
 * @Author: uustoboy 
 * @Date: 2020-11-30 00:06:36 
 * @Last Modified by: uustoboy
 * @Last Modified time: 2020-11-30 00:08:58
 */
'use strict';
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

/**
 * 专题公共路径;
 */
let specialUrl = path.join(__dirname,'/src/special');
let yearFile = fs.readdirSync(specialUrl);

let createListName = (url)=>{
	var urlArr = [];
	url.forEach((name)=>{
		urlArr.push({
			name: name,
	      	value: name
		});
	});
	return urlArr;
}

let pathYearList = createListName(yearFile);
let questions = [
	{
		type: 'list',
		name: 'pathYear',
		message: '选取哪年专题:',
		choices: pathYearList
	},
	{
		type: 'list',
		name: 'pathSpecial',
		message: '选取专题:',
		choices: []
	},
	{
		type: 'input',
		name: 'newSpecial',
		message: '输入新专题名称:',
		choices: ''
	}
];

let createInquirer = (questions)=>{
	let createQuestions = [questions];
	return new Promise((resolve,reject)=>{
		inquirer.prompt(createQuestions).then(answer=>{resolve(answer);})
	});
}

//创建文件夹；
let createFolder = (cmd) => new Promise((resolve,reject)=>{
	fse.ensureDir(cmd).then(()=>{
		resolve();
	}).catch((err)=>{
		console.log(`创建文件夹${cmd}出现错误了,错误是：${err}`);
		reject();
	});
});

let writeFile = (path)=>{
	fs.readFile('./package.json',(error,data)=>{
		if(error){
			console.log('读取文件出错了，错误是：'+error);
			return ;
		}
		let dataJson = JSON.parse(data.toString());
		dataJson.projectPath = path;
		fs.writeFile('./package.json',JSON.stringify(dataJson,null, 4),'utf8',function(err){
			if(err){
				console.log('写文件出错了，错误是：'+err);
				return ;
			}
			console.log(`成功切换到${path}项目！`);
		});
	});
}
createInquirer(questions[0]).then((answer)=>{
	let pathYear = answer.pathYear;
	let specialFile = fs.readdirSync(`${specialUrl}/${pathYear}`);
	let specialFileList = createListName(specialFile);
	specialFileList.unshift({name:'创建专题',value:'newSpecial'});
	questions[1].choices=specialFileList;
	createInquirer(questions[1]).then(answer=>{
		let pathSpecial =  answer.pathSpecial;
		if(pathSpecial == 'newSpecial'){
			
			createInquirer(questions[2]).then(answerNewSpecial=>{
				let newSpecialName = answerNewSpecial.newSpecial;
				const targetDir = path.join(specialUrl,`${pathYear}/${newSpecialName}` );
				if(fs.existsSync(targetDir)){
					console.log('已有项目');
					return ;
				}
				(async ()=>{
					await createFolder(targetDir);
					await createFolder(path.join(targetDir,'images'));
					await createFolder(path.join(targetDir,'js'));
					await createFolder(path.join(targetDir,'css'));
					fse.copy('./build/template.html', `${targetDir}/index.html`, function (err){
						if (err) return console.error(err);
						let endPath = `${pathYear}/${newSpecialName}`;
						writeFile(endPath);
						console.log(`${newSpecialName}文件夹创建完成！`); 
					});
				})();
			});
		}else{
			let endPath = `${pathYear}/${pathSpecial}`;
			writeFile(endPath);
		}
	})
})
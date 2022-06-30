const jwtAuth = require('../common/jwtAuth');
const queryService = require('../common/queryService');

const express = require('express');
const router = express.Router();

router.post('/', jwtAuth.ensureToken, createTodo);
router.put('/', jwtAuth.ensureToken, updateTodo);
router.delete('/', jwtAuth.ensureToken, deleteTodo);
router.get('/', jwtAuth.ensureToken, listTodo);

async function createTodo(req, res){		// date, title, status
	if(req.body.date && req.body.title && req.body.status){
		let query = "insert into todo (user_id, title, status, date) values (?,?,?,?)";
    	let resp = await queryService.fireQuery(query,[req.body.id, req.body.title, req.body.status, req.body.date]);
    	if(resp && resp.insertId){
			res.send({message: "Todo created successfully.", status: 1, data: {id: resp.insertId}})
    	}else{
    		res.send({message: "Something went wrong.", status: 0, data: {}})
    	}
	}else{
		res.send({message: "Invalid parameters.", status: 0, data: {}})
	}
}

async function updateTodo(req, res){		// todo_id, date/title/status
	if(req.body.todo_id){
		let parameters = "id = ?";
		let values = [req.body.todo_id];
		if(req.body.date){
			parameters = parameters+", date = ?";
			values.push(req.body.date);
		}
		if(req.body.title){
			parameters = parameters+", title = ?";
			values.push(req.body.title);
		}
		if(req.body.status){
			parameters = parameters+", status = ?";
			values.push(req.body.status);
		}
		if(values.length == 1){
			res.send({message: "Invalid parameters.", status: 0, data: {}})
			return false;
		}
		values.push(req.body.todo_id, req.body.id);
		let query = "update todo set "+parameters+" where id = ? and user_id = ?";
    	let resp = await queryService.fireQuery(query,values);
    	if(resp && resp.changedRows){
			res.send({message: "Todo updated successfully.", status: 1, data: {todo_id: req.body.todo_id}})
    	}else{
    		res.send({message: "Something went wrong.", status: 0, data: {}})
    	}
	}else{
		res.send({message: "Invalid parameters.", status: 0, data: {}})
	}
}

async function deleteTodo(req, res){		// todo_id
	if(req.body.todo_id){
		let query = "delete from todo where id = ? and user_id = ?";
    	let resp = await queryService.fireQuery(query,[req.body.todo_id, req.body.id]);
		res.send({message: "Todo deleted successfully.", status: 1, data: {todo_id: req.body.todo_id}})
	}else{
		res.send({message: "Invalid parameters.", status: 0, data: {}})
	}
}

async function listTodo(req, res){
	let query = "select * from todo where user_id = ?";
	let resp = await queryService.fireQuery(query,[req.body.id]);
	res.send({message: "Todo get successfully.", status: 1, data: {todo_id: resp}})
}

module.exports = router;

const config = require('./../config.json');
const jwtAuth = require('../common/jwtAuth');
const queryService = require('../common/queryService');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const express = require('express');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change_password', jwtAuth.ensureToken, changePassword);

async function registerUser(req, res){		// name, email, password
    if(req.body.email && req.body.password && req.body.name){
    	let query = "select email from user_info where email = ?";
    	let resp = await queryService.fireQuery(query,[req.body.email]);
    	if(resp && resp.length){
    		res.send({message: "Email already exists.", status: 0, data: {}})
    	}else{
    		let hash = md5(req.body.password);
    		let query = "insert into user_info (name, email, password) values (?,?,?)";
	    	let resp = await queryService.fireQuery(query,[req.body.name, req.body.email, hash]);
	    	if(resp && resp.insertId){
    			res.send({message: "User successfully registered.", status: 1, data: {id: resp.insertId}})
	    	}else{
	    		res.send({message: "Something went wrong.", status: 0, data: {}})
	    	}
    	}
    }else{
		res.send({message: "Invalid parameters.", status: 0, data: {}})
	}
}

async function loginUser(req, res){			// email, password
	if(req.body.email && req.body.password){
		let query = "select * from user_info where email = ?";
		let resp = await queryService.fireQuery(query,[req.body.email]);
		if(resp && resp.length){
			let hash = md5(req.body.password);
			if(resp[0].password == hash){
				const token = jwt.sign({ id: resp[0].id }, config.JWT_SECRET_KEY);       					// token expire default time is 7 days
		        // const token = jwt.sign({ id: resp[0].id }, config.JWT_SECRET_KEY,{ expiresIn: 20 });        // token expire in 20 seconds
		        // const token = jwt.sign({ id: resp[0].id }, config.JWT_SECRET_KEY,{ expiresIn: "20" });      // token expire in 20 miliseconds
		        																								// you can also set token expire time "2 days", "10h", "7d"
		        resp[0].token = token;
		        delete resp[0].password;
				res.send({message: "User successfully login.", status: 1, data: resp[0]})
			}else{
				res.send({message: "You have entered wrong password.", status: 0, data: {}})
			}
		}else{
			res.send({message: "Email not registered.", status: 0, data: {}})
		}
	}else{
		res.send({message: "Invalid parameters.", status: 0, data: {}})
	}
}

async function changePassword(req, res){		// oldPassword, newPassword
	if(req.body.oldPassword && req.body.newPassword){
		let query = "select * from user_info where id = ?";
		let resp = await queryService.fireQuery(query,[req.body.id]);
		if(resp && resp.length){
			let hash = md5(req.body.oldPassword);
			if(resp[0].password == hash){
				let hash = md5(req.body.newPassword);
				let query = "update user_info set password = ? where id = ?";
				let resp = await queryService.fireQuery(query,[hash, req.body.id]);
				res.send({message: "Password update successfully.", status: 1, data: {}})
			}else{
				res.send({message: "You have entered wrong old password.", status: 0, data: {}})
			}
		}else{
			res.send({message: "Email not registered.", status: 0, data: {}})
		}
	}else{
		res.send({message: "Invalid parameters.", status: 0, data: {}})
	}
}

module.exports = router;

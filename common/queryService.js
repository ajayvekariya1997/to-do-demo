function fireQuery(query,value){
	return new Promise((resolve, reject) => {
		connection.query(query, value, function(err, resp){
			if(err){
				reject(err);
			}else{
				resolve(resp);
			}
		})
	})
}

module.exports = {fireQuery};

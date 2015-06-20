var LogHistory = new function()
{

	this.addLog = function (type, message, createdAt)
	{
		$('#table-log').prepend('<tr><td class="col1">' + type + '</td><td class="col2">' + message + '</td><td class="col3">' + createdAt + '</td></tr>');
	};

};
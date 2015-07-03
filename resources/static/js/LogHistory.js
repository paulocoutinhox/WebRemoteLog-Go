var LogHistory = new function()
{

	var token           = "";
	var lastDateTime    = null;
	var isGettingNewest = false;
	var firstTime       = true;

	this.lastDateTime = Util.dateToMongoDateString(new Date());

	this.addLog = function(id, type, message, createdAt)
	{
		var typeHtml = '';
		
		if (type == 'error' || type == 'fatal')
		{
			typeHtml = '<span class="label label-danger">' + type + '</span>';
		}
		else if (type == 'info' || type == 'information')
		{
			typeHtml = '<span class="label label-info">' + type + '</span>';
		}
		else if (type == 'warn' || type == 'warning')
		{
			typeHtml = '<span class="label label-warning">' + type + '</span>';
		}
		else if (type == 'debug' || type == 'trace' || type == 'echo' || type == 'verbose')
		{
			typeHtml = '<span class="label label-primary">' + type + '</span>';
		}
		else if (type == 'success')
		{
			typeHtml = '<span class="label label-success">' + type + '</span>';
		}
		else 
		{
			typeHtml = '<span class="label label-default">' + type + '</span>';
		}
		
		var html = '<tr id="log-row-' + id + '" class="log-row log-row-type-' + type.toLowerCase() + '"><td class="col1">' + typeHtml + '</td><td class="col2">' + message + '</td><td class="col3">' + Util.dateToUserString(new Date(createdAt)) + '</td></tr>';
		
		$('#table-log').append(html);
	}

	this.getNewest = function()
	{
		if (isGettingNewest)
		{
			return;
		}
		
		isGettingNewest = true;
		
		var lastDateTimeToSend = (Util.isUndefined(this.lastDateTime) ? "" : this.lastDateTime);
		
	    $.ajax({
		   url: '/api/log/list?token=' + this.token + "&created_at=" + lastDateTimeToSend,
		   type: 'GET',
		   dataType: 'json',
		   success: function(data) {
		       if (!Util.isUndefined(data)) 
		       {
			       if (data != "" && data != null)
			       {
				       for (var x = 0; x < data.length; x++)
				       {
					       if (!$("#log-row-" + data[x].ID).length > 0)
					       {
						       LogHistory.lastDateTime = Util.dateToMongoDateString(new Date(data[x].CreatedAt));
						       LogHistory.addLog(data[x].ID, data[x].LogType, data[x].LogMessage, data[x].CreatedAt);    
					       }
				       }
				       
				       if ($('#chkAutoScrollBottom').is(':checked')) 
				       {
					       Util.scrollToBottom();
				       }
			       }    
			       
			       if (LogHistory.firstTime)
			       {
				       LogHistory.firstTime = false;
			       }
		       }
		       
		       isGettingNewest = false;
		   },
		   error: function() {
		      isGettingNewest = false;
		   }
		});
	}
	
	this.getToken = function()
	{
		this.token = Util.getQueryParam("token");
	}
	
	this.startAutoGetNewest = function()
	{
		setInterval(function(){ LogHistory.getNewest(); }, 1000);
	}
	
	this.clear = function()
	{
		$('.log-row').remove();
	}
	
	this.deleteAllByToken = function()
	{
		$.ajax({
		   url: '/api/log/deleteAll?token=' + this.token,
		   type: 'GET',
		   dataType: 'json',
		   success: function(data) {
			   if ($('#chkAutoScrollBottom').is(':checked')) 
		       {
			       LogHistory.clear();
			       Util.scrollToBottom();
		       }
		   },
		   error: function() {
		      // ignore
		   }
		});
	}
	
};
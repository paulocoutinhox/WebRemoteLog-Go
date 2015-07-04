var LogHistory = new function()
{

	var token                = "";
	var lastDateTime         = null;
	var isGettingNewest      = false;
	var firstTime            = true;
	var isOnBottomOfDocument = false;
	var filterMessageTmp     = "";
	var request;

	this.lastDateTime = Util.dateToMongoDateString(new Date());

	this.initialize = function()
	{
		$('.scroll-top-wrapper').addClass('show');
		
		$('#logDetailsModal, #optionsModal').on('show.bs.modal', function(event) {
			$('.scroll-top-wrapper').removeClass('show');
			$('.scroll-top-wrapper').addClass('hidden');
		});
		
		$('#logDetailsModal, #optionsModal').on('hidden.bs.modal', function(event) {
			$('.scroll-top-wrapper').removeClass('hidden');
			$('.scroll-top-wrapper').addClass('show');
		});
		
		$('#logDetailsModal').on('shown.bs.modal', function(event) {
			$('#logDetailsMessage').focus().select();			
		});	
		
		$('#filterMessage').on('keyup',function(event) {
			if(event.keyCode == 13)
		    {
			    LogHistory.applyFilters();
		    }
		});
		
		LogHistory.getToken();
		LogHistory.startAutoGetNewest();
	}

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
		
		var html = '<tr id="log-row-' + id + '" class="log-row log-row-type-' + type.toLowerCase() + '"><td class="col1">' + typeHtml + '</td><td class="col2" onclick="LogHistory.showDetails(\'' + id + '\')">' + message + '</td><td class="col3">' + Util.dateToUserStringUsingHTML(new Date(createdAt)) + '</td></tr>';
		
		if (Util.isOnBottomOfDocument())
		{
			this.isOnBottomOfDocument = true;
		}
		else
		{
			this.isOnBottomOfDocument = false;
		}
		
		$('#table-log').append(html);
	}

	this.getNewest = function()
	{
		if (isGettingNewest)
		{
			return;
		}
		
		isGettingNewest = true;
		
		var lastDateTimeToSend     = (Util.isUndefined(this.lastDateTime) ? "" : this.lastDateTime);
		var filterMessageTmpToSend = (Util.isUndefined(this.filterMessageTmp) ? "" : this.filterMessageTmp);
		
	    this.request = $.ajax({
		   url: '/api/log/list?token=' + this.token + "&created_at=" + lastDateTimeToSend + "&filter-message=" + filterMessageTmpToSend,
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
					       if (LogHistory.isOnBottomOfDocument)
					       {
					           Util.scrollToBottom();
					       }
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
	
	this.showDetails = function(logId)
	{		
		$('#logDetailsType').html($('#log-row-' + logId + ' > td.col1').html());
		$('#logDetailsMessage').text($('#log-row-' + logId + ' > td.col2').html());
		$('#logDetailsCreatedAt').html($('#log-row-' + logId + ' > td.col3').html());				
		$('#logDetailsModal').modal();
	}
	
	this.clearLogFilters = function()
	{		
		this.filterMessageTmp = '';
		$('#filterMessage').val('');
	}
	
	this.showLogFilters = function(show)
	{		
		if (show)
		{
			$('#filtersContainer').show();
		}
		else
		{
			$('#filtersContainer').hide();			
		}
	}
	
	this.applyFilters = function()
	{	
		if (!Util.isUndefined(this.request))
		{	
			this.request.abort();
		}
		
		this.filterMessageTmp = $('#filterMessage').val();
		this.clear();
	}
	
};
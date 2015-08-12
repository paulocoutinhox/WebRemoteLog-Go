var LogHistory = new function()
{

	var token                               = "";
	var lastDateTime                        = null;
	var isGettingNewest                     = false;
	var isGettingNewestLogStatsByTypeChart  = false;
	var firstTime                           = true;
	var isOnBottomOfDocument                = false;
	var filterMessageTmp                    = "";
	var request;

	this.colorList    = [];
	this.lastDateTime = Util.dateToMongoDateString(new Date());

	this.initialize = function()
	{
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
		LogHistory.startAutoClean();
	}

	this.addLog = function(id, type, message, createdAt)
	{
		var typeHtml = '';
		
		if (type == 'error' || type == 'fatal')
		{
			typeHtml = 'panel-danger';
		}
		else if (type == 'info' || type == 'information')
		{
			typeHtml = 'panel-info';
		}
		else if (type == 'warn' || type == 'warning')
		{
			typeHtml = 'panel-warning';
		}
		else if (type == 'debug' || type == 'trace' || type == 'echo' || type == 'verbose')
		{
			typeHtml = 'panel-primary';
		}
		else if (type == 'success')
		{
			typeHtml = 'panel-success';
		}
		else 
		{
			typeHtml = 'panel-primary';
		}
		
		var createdAtConverted = Util.dateToUserStringUsingHTML(Util.convertUTCDateToLocalDate(new Date(createdAt)));

		/*
		<div class="panel panel-primary">
        			<div class="panel-heading">
        				<h3 class="panel-title">Message</h3>
        			</div>
        			<div class="panel-body">
        				No results :(
        			</div>
        		</div>
		*/

		var html = '' +
		'<div id="log-row-' + id + '" class="panel ' + typeHtml + ' log-row log-row-type-' + type.toLowerCase() + '" onclick="LogHistory.showDetails(\'' + id + '\')">' +
		'    <div class="panel-heading">' +
		'        <h3 class="panel-title">' +
		'            <p>Type: <span id="log-data-type-' + id + '">' + type + '</span></p>' +
		'            <p>Created at: <span id="log-data-created-at-' + id + '">' + createdAtConverted + '</span></p>' +
		'        </h3>' +
		'    </div>' +
		'    <div class="panel-body">' +
		'        <span id="log-data-message-' + id + '">' + message + '<span>'
		'    </div>' +
		'</div>';

		if (Util.isOnBottomOfDocument())
		{
			this.isOnBottomOfDocument = true;
		}
		else
		{
			this.isOnBottomOfDocument = false;
		}
		
		$('#results').append(html);
		this.showResults();
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
					       if (Util.isUndefined(LogHistory.request) || LogHistory.request == null)
					       {
						       return;
					       }
					       
					       if (!$("#log-row-" + data[x].ID).length > 0)
					       {
						       LogHistory.lastDateTime = Util.dateToMongoDateString(new Date(data[x].CreatedAt));
						       LogHistory.addLog(data[x].ID, data[x].Type, data[x].Message, data[x].CreatedAt);

						       if ($('#chkAutoScrollBottom').is(':checked'))
							   {
								   if (LogHistory.isOnBottomOfDocument)
								   {
									   Util.scrollToBottom();
								   }
							   }
					       }
				       }
			       }    
			       
			       if (LogHistory.firstTime)
			       {
				       LogHistory.firstTime = false;
			       }
		       }
		       
		       isGettingNewest = false;
		       LogHistory.showResultsOrNoResultsByLogsQuantity();
		   },
		   error: function() {
		      isGettingNewest = false;
		      LogHistory.showResultsOrNoResultsByLogsQuantity();
		   }
		});
	}

	this.getNewestLogStatsByTypeChart = function()
	{
		if (isGettingNewestLogStatsByTypeChart)
		{
		    return;
		}

		isGettingNewestLogStatsByTypeChart = true;

		var chartData = [];
		var chartLegend = "";
		var request = $.ajax({
		   url: '/api/log/statsByType?token=' + this.token,
		   type: 'GET',
		   dataType: 'json',
		   success: function(data) {
			   var showResults = false;

			   if (!Util.isUndefined(data))
			   {
				   if (data != "" && data != null)
				   {
					   for (var x = 0; x < data.length; x++)
					   {
					        chartData.push({
							    value: data[x].quantity,
							    label: data[x].type,
							    color: LogHistory.colorList[x],
						    });

						    chartLegend += '' +
						    '<li>' +
						    '    <span class="chart-legend-color" style="background-color: ' + LogHistory.colorList[x] + '"></span>' +
						    '    <span class="chart-legend-label">' + data[x].type + ' (' + data[x].quantity + ')</span>' +
						    '</li>';

						    showResults = true;
					   }
				   }
			   }

			   if (showResults)
			   {
			   	   $('#chart-legend').html(chartLegend);

			   	   LogHistory.showResults('chart');

			       Chart.defaults.global.responsive = true;

				   var ctx = document.getElementById('chart-canvas').getContext('2d');
				   var chart = new Chart(ctx).Doughnut(chartData, {
						animation: false
				   });
			   }
			   else
			   {
			   	   LogHistory.showNoResults('chart');
			   }

			   isGettingNewestLogStatsByTypeChart = false;
		   },
		   error: function() {
			   LogHistory.showNoResults('chart');
			   isGettingNewestLogStatsByTypeChart = false;
		   }
		});
	}
	
	this.getToken = function()
	{
		this.token = Util.getQueryParam("token");
	}
	
	this.startAutoGetNewest = function()
	{
		var seconds = 1;
		setInterval(function(){ LogHistory.getNewest(); }, (seconds * 1000));
	}

	this.startAutoGetNewestLogStatsByTypeChart = function()
	{
		LogHistory.getToken();

		for (var x = 0; x < 255; x++)
		{
		    this.colorList.push(Util.getRandomColor());
		}

		var seconds = 5;
		LogHistory.getNewestLogStatsByTypeChart();
		setInterval(function(){ LogHistory.getNewestLogStatsByTypeChart(); }, (seconds * 1000));
	}

	this.startAutoClean = function()
	{
		var seconds = 10;
		setInterval(function(){ LogHistory.removeOldLogsFromPage(); }, (seconds * 1000));
	}

	this.clear = function()
	{
		$('.log-row').remove();
		this.showNoResults();
	}
	
	this.deleteAllByToken = function()
	{
		this.showLoadingResults();

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
		$('#logDetailsType').html($('#log-data-type-' + logId + '').html());
		$('#logDetailsMessage').text($('#log-data-message-' + logId + '').html());
		$('#logDetailsCreatedAt').html($('#log-data-created-at-' + logId + '').html());
		$('#logDetailsModal').modal();
	}
	
	this.clearLogFilters = function()
	{		
		this.filterMessageTmp = '';
		$('#filterMessage').val('');
		this.resetRequest();		
		this.clear();
		this.showLoadingResults();
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
		this.resetRequest();
		this.filterMessageTmp = $('#filterMessage').val();
		this.clear();
		this.showLoadingResults();
	}
	
	this.resetRequest = function()
	{
		if (!Util.isUndefined(this.request))
		{	
			this.request.abort();
			this.request = null;
		}
		
		isGettingNewest = false;
	}

	this.removeOldLogsFromPage = function()
	{
		var offset         = 200;
		var total          = $('.log-row').length;
		var offsetToRemove = (total - offset);

		if (total > offset)
		{
			$('.log-row').slice(0, offsetToRemove).remove();
		}
	}

	this.showResults = function(prefix)
	{
		if (Util.isUndefined(prefix))
		{
			prefix = "";
		}
		else
		{
		    prefix += "-";
		}

		if ($('#' + prefix + 'results').is(':hidden'))
		{
		    $('#' + prefix + 'results').show();
		}

		$('#' + prefix + 'no-results').hide();
		$('#' + prefix + 'loading-results').hide();
	}

	this.showNoResults = function(prefix)
	{
		if (Util.isUndefined(prefix))
		{
			prefix = "";
		}
		else
		{
		    prefix += "-";
		}

		if ($('#' + prefix + 'no-results').is(':hidden'))
		{
		    $('#' + prefix + 'no-results').show();
		}

		$('#' + prefix + 'results').hide();
		$('#' + prefix + 'loading-results').hide();
	}

	this.showLoadingResults = function(prefix)
	{
		if (Util.isUndefined(prefix))
		{
			prefix = "";
		}
		else
		{
		    prefix += "-";
		}

		if ($('#' + prefix + 'loading-results').is(':hidden'))
		{
		    $('#' + prefix + 'loading-results').show();
		}

		$('#' + prefix + 'results').hide();
		$('#' + prefix + 'no-results').hide();
	}

	this.showResultsOrNoResultsByLogsQuantity = function(prefix)
	{
		if (Util.isUndefined(prefix))
		{
			prefix = "";
		}
		else
		{
		    prefix += "-";
		}

		if ($('.log-row').length > 0)
		{
		    this.showResults(prefix);
		}
		else
		{
			this.showNoResults(prefix);
		}
	}

	this.redirectToLogStatsByType = function()
	{
	    Util.redirect("/log/statsByType?token=" + this.token);
	}

	this.redirectToLogHistory = function()
	{
	    Util.redirect("/log/index?token=" + this.token);
	}

};
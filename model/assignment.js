var xml          = require('../lib/xml-native')
    EventEmitter = require('events').EventEmitter;

module.exports = function(config) {
  var request    = require('../lib/request')(config)
    , inherits   = require('util').inherits
    , Base       = require('./base')
    , ret;

  function Assignment() {
  }
  

  inherits(Assignment, Base);

  ret = Assignment;

  Assignment.prototype.populateFromResponse = function(response) {
    var self = this
      , rs;
    
    Base.prototype.populateFromResponse.call(this, response, {
        AssignmentId: 'id'
      , HITId: 'hitId'
    });
    if (this.answer) {
      rs = new EventEmitter();
      xml.decodeReadStream(rs, function(err, root) {
        self.answer = root;
      });
      rs.emit('data', this.answer);
      rs.emit('end');
    }
  };

  /*
   * Approves a Assignment
   *
   * @param {assignmentId} the Assignment id (string)
   * @param {requesterFeedback} A message for the Worker, which the Worker can see in the Status section of the web site. (string max 1024 characters). Optional.
   * @param {callback} function with signature (error)
   * 
   */
  ret.approve = function approve(assignmentId, requesterFeedback, callback) {
    var options = {
        AssignmentId: assignmentId
      , RequesterFeedback: requesterFeedback
    };
    request('AWSMechanicalTurkRequester', 'ApproveAssignment', 'POST', options, function(err, response) {
      if (err) { return callback(err); } 
      if (! Assignment.prototype.nodeExists(['ApproveAssignmentResult', 'Request', 'IsValid'], response)) { callback([new Error('No "ApproveAssignmentResult > Request > IsValid" node on the response')]); return; }
      if (response.ApproveAssignmentResult.Request.IsValid.toLowerCase() != 'true') {
        return callback([new Error('Response says ApproveAssignmentResult request is invalid: ' + JSON.stringify(response.ApproveAssignmentResult.Request.Errors))]);
      }
      callback(null);
    });
  }


  /*
   * Approves the Assignment
   *
   * @param {requesterFeedback} A message for the Worker, which the Worker can see in the Status section of the web site. (string max 1024 characters). Optional
   * @param {callback} function with signature (error)
   * 
   */
  Assignment.prototype.approve = function(requesterFeedback, callback) {
    return ret.approve(this.id, requesterFeedback, callback);
  };


  /*
   * Rejects a Assignment
   *
   * @param {assignmentId} the Assignment id (string)
   * @param {requesterFeedback} A message for the Worker, which the Worker can see in the Status section of the web site. (string max 1024 characters). Optional.
   * @param {callback} function with signature (error)
   * 
   */
  ret.reject = function reject(assignmentId, requesterFeedback, callback) {
    var options = {
        AssignmentId: assignmentId
      , RequesterFeedback: requesterFeedback
    };
    request('AWSMechanicalTurkRequester', 'RejectAssignment', 'POST', options, function(err, response) {
      if (err) { return callback(err); } 
      if (! Assignment.prototype.nodeExists(['RejectAssignmentResult', 'Request', 'IsValid'], response)) { callback([new Error('No "RejectAssignmentResult > Request > IsValid" node on the response')]); return; }
      if (response.RejectAssignmentResult.Request.IsValid.toLowerCase() != 'true') {
        return callback([new Error('Response says RejectAssignmentResult request is invalid: ' + JSON.stringify(response.RejectAssignmentResult.Request.Errors))]);
      }
      callback(null);
    });
  }


  /*
   * Rejects the Assignment
   *
   * @param {requesterFeedback} A message for the Worker, which the Worker can see in the Status section of the web site. (string max 1024 characters). Optional
   * @param {callback} function with signature (error)
   * 
   */
  Assignment.prototype.reject = function(requesterFeedback, callback) {
    return ret.reject(this.id, requesterFeedback, callback);
  };


   /*
   * Approves a rejected Assignment
   *
   * @param {assignmentId} the Assignment id (string)
   * @param {requesterFeedback} A message for the Worker, which the Worker can see in the Status section of the web site. (string max 1024 characters). Optional.
   * @param {callback} function with signature (error)
   * 
   */
  ret.approveRejected = function approveRejected(assignmentId, requesterFeedback, callback) {
    var options = {
        AssignmentId: assignmentId
      , RequesterFeedback: requesterFeedback
    };
    request('AWSMechanicalTurkRequester', 'ApproveRejectedAssignment', 'POST', options, function(err, response) {
      if (err) { return callback(err); } 
      if (! Assignment.prototype.nodeExists(['ApproveRejectedAssignmentResult', 'Request', 'IsValid'], response)) { callback([new Error('No "ApproveRejectedAssignmentResult > Request > IsValid" node on the response')]); return; }
      if (response.ApproveRejectedAssignmentResult.Request.IsValid.toLowerCase() != 'true') {
        return callback([new Error('Response says ApproveRejectedAssignmentResult request is invalid: ' + JSON.stringify(response.ApproveRejectedAssignmentResult.Request.Errors))]);
      }
      callback(null);
    });
  }

  /*
  * Get Assignments for a HIT
  */
  ret.getAssignmentsForHIT = function(hitid, callback){
    var options = {
        HITId: hitid
    };
    request('AWSMechanicalTurkRequester', 'GetAssignmentsForHIT', 'POST', options, function(err, response) {
      if (err) { return callback(err); } 
      if (! Assignment.prototype.nodeExists(['GetAssignmentsForHITResult', 'Request', 'IsValid'], response)) { callback([new Error('No "GetAssignmentsForHITResult > Request > IsValid" node on the response')]); return; }
      if (response.GetAssignmentsForHITResult.Request.IsValid.toLowerCase() != 'true') {
        return callback([new Error('Response says GetAssignmentsForHITResult request is invalid: ' + JSON.stringify(response.ApproveRejectedAssignmentResult.Request.Errors))]);
      }
      callback(response);
    });
  }
  /*
   * Approves the rejected Assignment
   *
   * @param {requesterFeedback} A message for the Worker, which the Worker can see in the Status section of the web site. (string max 1024 characters). Optional
   * @param {callback} function with signature (error)
   * 
   */
  Assignment.prototype.approveRejected = function(requesterFeedback, callback) {
    return ret.approveRejected(this.id, requesterFeedback, callback);
  };


  
  return ret;
  
};
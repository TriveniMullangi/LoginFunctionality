var logger = require('../util/logger');
var HTTP_CODES = require('../util/statusCodes');
var questionsModel = require('../model/questions.model');

//storing questions in databse
var addQuestions =  async (req,res,next)=>{
   console .log("URL hit to :", req.hostname, req.originalUrl);
    logger.info("Entered into questions adding service");
    try{
        let payLoad = req.body;
        payLoad.questions = JSON.stringify(req.body.questions)
        // res.send(payLoad)
        if(payLoad != undefined)
        {
            var data = await questionsModel.Questions.create(payLoad)
                res.status(HTTP_CODES.OK).send({
                "statusCode": HTTP_CODES.OK,
                "info": "course added successfully",
                "data" : data
                })
           
            .catch(err=>{
                console.log(err);
            })
            
        }
    }
    catch(err)
    {
        next(err);
    }
}

var getAll = async (req,res,next)=>{
    console .log("URL hit to :", req.hostname, req.originalUrl);
    logger.info("Entered into questions adding service");
    try{
        let technology = req.query.technologyCode;
        let min1 =8,max1 = 10, questions=[],questionNumbers=[],options= [];
        let numberOfQuestions = Math.floor(Math.random() * 3) + 8;
        console.log(numberOfQuestions)
        while(questionNumbers.length < numberOfQuestions){
           //console.log("hi")
            let questionNumber = Math.floor(Math.random() * 15 ) + 1;
                if(questionNumbers.indexOf(questionNumber) === -1) questionNumbers.push(questionNumber);
            }  
        console.log(questionNumbers)

       while(options.length <4){
               var r = Math.floor(Math.random()*4 )+1;
               if(options.indexOf(r) === -1) options.push(r);
           }       
           console.log(options)
        
        let data = await questionsModel.Questions.findAll({
            where :{
                "technologyCode" : technology
            }
        });
        if(data.length!=0){
            data[0].questions = JSON.parse(data[0].questions);
        
        for(var qno=0 ; qno<questionNumbers.length ; qno++){
            
            let question ={};

            
            question.qid = data[0].questions[questionNumbers[qno]-1].qid;

            question.q= data[0].questions[questionNumbers[qno]-1].q;

            question.o1 = data[0].questions[questionNumbers[qno]-1].options[options[0]-1];
            question.o2 = data[0].questions[questionNumbers[qno]-1].options[options[1]-1];
            question.o3 = data[0].questions[questionNumbers[qno]-1].options[options[2]-1];
            question.o4 = data[0].questions[questionNumbers[qno]-1].options[options[3]-1];
            question.answer=""
            questions.push(question);
            question ={}
        }
        res.status(HTTP_CODES.OK).send({
            "statusCode": HTTP_CODES.OK,
            "technology": data[0].technology,
            "technologyCode":data[0].technologyCode,
            "questions":questions
            })
    }
    else{
        res.status(HTTP_CODES.BAD_REQUEST).send({
            "statusCode": HTTP_CODES.BAD_REQUEST,
            "info": "select valid course"

            })
    }
}
    catch(err){
        next(err);
    }
}

module.exports = {
    addQuestions : addQuestions,
    getAll : getAll
}
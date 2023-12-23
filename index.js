var express = require("express");
const bodyParser = require("body-parser");
const storage = require("node-persist");
var app = express();
const PORT = 5000;

var jsonParser = bodyParser.json();
storage.init();

//Code to show details of all the students alltogether
app.get("/allStudents", async (req, res) => {
  const resp = await storage.values(); //Extract all the values stored in storage
  res.write(`
        <h1>All student details</h1>
    `);
  await storage.forEach(async (data) => { //wait for the storage to load and loop through the storage and getting data asynchronusly
    res.write(`
           <h3> Student ID: ${data.value.student_id}</h3>
           <h3> Student name: ${data.value.student_name}</h3>
           <h3> GPA: ${data.value.gpa}</h3>
        `);
  });
});


//Code to show details of each student
app.get("/student/:id", async (req, res) => {
  const user = await storage.getItem(req.params.id);

  await storage.forEach(async (data) => {
    res.write("<h1>Student detail</h1>");
    if (data.value.student_id === user) {
      res.send(`
                <h3>Student id: ${data.value.student_id}</h3> 
                <h3>Student name: ${data.value.student_name}</h3>
                <h3>GPA: ${data.value.gpa}</h3>
                `);
    }
  });
});

//Code to identify the class topper
app.get('/topper', async(req,res) => {   
    const resp = await storage.values()
    let i;
    const gpaList = [];

    for(i=0; i<resp.length; i++){        // logic for creating gpa list and getting the highest gpa among all
        gpaList[i] = parseFloat(resp[i].gpa); 

        var highestGPA = gpaList[0];
        if(gpaList[i]>highestGPA){
            highestGPA = gpaList[i];
        }
        
        if(highestGPA == resp[i].gpa){   // Logic to identify student with highest gpa
            var myRes =`
            <h3> Student id: ${resp[i].student_id}
            <h3> Student name: ${resp[i].student_name}
            <h3> GPA: ${resp[i].gpa}
            `
            
        }
    }
    res.send(`<h1> Student Details</h1> ${myRes}`);
})

//Post details of all students to node-persist temporary storage
app.post("/allStudents", jsonParser, async (req, res) => {
  const { student_id, student_name, gpa } = req.body;

  console.log(student_id, student_name, gpa);

  await storage.setItem(student_id, { student_id, student_name, gpa });
  res.send("Student added successfully!");
});
app.listen(PORT, () => {
  console.log(`Server has started on port = ${PORT}`);
});





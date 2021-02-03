class Project {
  constructor() {

  }
  create(){
    console.log('generating new project');
    const fs = require('fs');
    fs.mkdirSync(arguments[1]);
    process.chdir(arguments[1]);
    exec('npm i simurgh',(e,s1,s2)=>{
      if(e){
        console.log('error occured! try again later');
          }
          else{
            console.log();
          console.log('project create , execute "simurgh run-web" in project directory to build your project');
    }
    });
  }
}

export default Project;

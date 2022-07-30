const express = require('express')
const app = express()
const port = 3000
const moment = require('moment')
const path = require('path')

app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

// Global variable
let projects = [] 

// Routes
app.get('/', (req, res) => {
  const newProjects = projects.map((project) => {
    if (project.technologies) {
      if (project.technologies.includes('nodejs')) {
        project.nodejs = true
      }
      if (project.technologies.includes('nextjs')) {
        project.nextjs = true
      }
      if (project.technologies.includes('reactjs')) {
        project.reactjs = true
      }
      if (project.technologies.includes('typescript')) {
        project.typescript = true
      }
    }
    
    project.duration= getDuration(project.startDate, project.endDate)
    return project
  })
  res.render('index', {newProjects: newProjects})
})

app.get('/project-detail/:index', (req, res) => {
  const newProjects = projects.map((project) => {
    const newProject = {
      ...project,
      startDate: moment(project.startDate).locale('id').format('ll'),
      endDate: moment(project.endDate).locale('id').format('ll')
    }
    return newProject
  })
  const index = req.params.index
  const newProject = newProjects[index]
  res.render('project-detail', {project: newProject})
})

app.get('/add-project', (req, res) => {
  res.render('project-form')
})

app.post('/add-project', (req, res) => {
  let project = req.body
  projects.push(project)
  res.redirect('/')
})

app.get('/edit-project/:index', (req, res) => {
  const index = req.params.index
  let project = projects[index]
  res.render('project-edit', {project: project, index: index})
})

app.post('/edit-project/:index', (req, res) => {
  console.log(projects);
  const index = req.params.index
  let newProject = req.body
  newProject.duration = getDuration(newProject.startDate, newProject.endDate)
  projects[index] = newProject
  console.log(projects);
  res.redirect('/')
})

app.get('/delete-project/:index', (req, res) => {
  const index = req.params.index
  projects.splice(index, 1)
  res.redirect('/')
})

app.get('/contact', (req, res) => {
  res.render('contact')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function getDuration(startDate, endDate) {
  const a = moment(endDate)
  const b = moment(startDate)

  let month = a.diff(b, 'month');
  let duration = '';

  if (month == 12) {
    duration = '1 tahun';
  } else if (month > 12) {
    let year = a.diff(b, 'year');
    month %= 12; // calculate exceeding month
    if (month == 0) {
      duration = `${year} tahun`;
    } else {
      duration = `${year} tahun ${month} bulan`;
    }
  } else {
    duration = `${month} bulan`
    if (month < 1) {
      let day = a.diff(b, 'day');
      duration = `${day} hari`;
    }
  }
  return duration
}
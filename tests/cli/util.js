const path = require('path')
const spawn = require('spawn-command')
const fs = require('fs')

const cliTest = (title, testPath, options) => {
  test(title, async () => {
    let resolvePath = p => path.join(__dirname, p)

    let [exitCode, stdout, stderr] = await runCli(
      ['codegen'],
      resolvePath(`./${testPath}`)
    )

    let expectedExitCode = undefined
    if (options !== undefined && options.exitCode) {
      expectedExitCode = options.exitCode
    }

    let expectedStdout = undefined
    try {
      expectedStdout = fs.readFileSync(resolvePath(`./${testPath}.stdout`), 'utf-8')
    } catch (e) {}

    let expectedStderr = undefined
    try {
      expectedStderr = fs.readFileSync(resolvePath(`./${testPath}.stderr`), 'utf-8')
    } catch (e) {}

    if (expectedExitCode !== undefined) {
      expect(exitCode).toBe(expectedExitCode)
    }
    if (expectedStdout !== undefined) {
      expect(stdout).toBe(expectedStdout)
    }
    if (expectedStderr !== undefined) {
      expect(stderr).toBe(expectedStderr)
    }
  })
}

const runCli = async (args = [], cwd = process.cwd()) => {
  // Resolve the path to graph.js
  let graphCli = path.join(__dirname, '..', '..', 'graph.js')

  // Make sure to set an absolute working directory
  cwd = cwd[0] !== '/' ? path.resolve(__dirname, cwd) : cwd

  return new Promise((resolve, reject) => {
    let stdout = ''
    let stderr = ''
    const command = `${graphCli} ${args.join(' ')}`
    const child = spawn(command, { cwd })

    child.on('error', error => {
      reject(error)
    })

    child.stdout.on('data', data => {
      stdout += data.toString()
    })

    child.stderr.on('data', data => {
      stderr += data.toString()
    })

    child.on('exit', exitCode => {
      resolve([exitCode, stdout, stderr])
    })
  })
}

module.exports = {
  cliTest,
  runCli,
}
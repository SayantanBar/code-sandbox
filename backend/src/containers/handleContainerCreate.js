import Docker from "dockerode";
const docker = new Docker();
export const listContainer = async () => {
  const containers = await docker.listContainers();
  console.log("Containers", containers);
  // PRINT PORTS ARRAY FROM ALL CONTAINER
  containers.forEach((containerInfo) => {
    console.log(containerInfo.Ports);
  });
};
export const handleContainerCreate = async (
  projectId,
  terminalSocket,
  req,
  tcpSocket,
  head
) => {
  console.log("ProjectId received in container ", projectId);
  try {
    const existingContainer = await docker.listContainers({
      name: projectId,
    });
    console.log("Existing container", existingContainer);

    if (existingContainer.length > 0) {
      console.log("Container already exists, stopping and removing it");
      const container = docker.getContainer(existingContainer[0].Id);
      await container.remove({ force: true });
    }

    console.log("Creating a new container");

    const container = await docker.createContainer({
      Image: "sandbox", // name given by us for the written dockerfile
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ["/bin/bash"],
      name: projectId,
      Tty: true,
      User: "sandbox",
      Volumes: {
        "/home/sandbox/app": {},
      },
      ExposedPorts: {
        "5173/tcp": {},
      },
      Env: ["HOST=0.0.0.0"],
      HostConfig: {
        Binds: [
          // mounting the project directory to the container
          `${process.cwd()}/projects/${projectId}:/home/sandbox/app`,
        ],
        PortBindings: {
          "5173/tcp": [
            {
              HostPort: "0", // random port will be assigned by docker
            },
          ],
        },
      },
    });
    console.log("container created!", container.id);
    await container.start();
    console.log("container started successfully!!");

    // Below is the place where we upgrade the connection to websocket
    terminalSocket.handleUpgrade(req, tcpSocket, head, (establishedWSConn) => {
      console.log("connection upgraded to websocket");

      terminalSocket.emit("connection", establishedWSConn, req, container);
    });
  } catch (error) {
    console.log("Error while creating container!", error);
  }
};

export async function getContainerPort(containerName) {
  // const container = docker.listContainers({ name: containerName });
  // if (container.length > 0) {
  //   const containerInfo = await docker.getContainer(container[0].Id).inspect();
  //   console.log(containerInfo);
  //   return;
  // }

  try {
    const containers = await docker.listContainers({
      filters: {
        name: [containerName], // note: this is an array
      },
    });
    if (containers.length === 0) {
      console.error(`No container found with name: ${containerName}`);
      return null;
    }
    const container = docker.getContainer(containers[0].Id);
    const containerInfo = await container.inspect();
    const ports = containerInfo.NetworkSettings.Ports;
    const portMappings = Object.entries(ports);
    if (portMappings.length > 0) {
      const [_, hostBindings] = portMappings[0]; // _ = '5173/tcp', hostBindings = array of bindings
      const hostPort = hostBindings?.[0]?.HostPort;
      console.log("host port", hostPort);

      return hostPort || null;
    }
    return null;
  } catch (error) {
    onsole.error("Error fetching container info:", error);
    return null;
  }
}

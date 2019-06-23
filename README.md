1. Create a Dockerfile for the service - optimise for image size and build time - for both: less is 
better. 

To achieve this, firstly I have used a smaller image (8.16.0-alpine) and secondly I have taken just the 
binary of the first built contianter spun a second container which has only the binary and hence smaller

2. Create a docker-compose file that allows to run the service without having a local dependency to 
postgres. Furthermore, removing the manual step in testing: "1. start the service, 2. test it" would 
raise the automatibility of the testing.

To achieve this I have spun another container having a postgres server and made a connection from the 
container which runs our service.
To solve the second aspect my best guess would be to run the "npm test" command in the Dockerfile. 

3. Using `config.json` for service configuration works well in a local file system or with a "static" 
configuration. In a production scenario we need a better way to configure the service. Please think of
 a good approach and prepare / implement.

Not solved.

4. Prepare the service for a CI/CD scenario: Please create two scripts to act as interface for a CI/CD 
service:

  * `test.sh`: should verify that the functional properties of the service are as expected.

    file committed

  * `build.sh`: should create a productiom ready docker image.

    file committed

5. To assist future development on the service, bring automation into place that helps to create high 
quality code. Add a script `quality.sh` that applies checks and tests to keep / improve the quality of 
the service. To give some inspiration: linting, checks for code smells, security checks, pretty 
printing, ...

Unfortunately I'm not familiar with these concepts and would probably need some time to learn 
implement them.

6. How would you design the CI/CD pipeline for our service? Please give a brief overview of the steps the service would need to go through to make his way from "commit pushed to repository" to "service is running in production".

Since Stocard's infra is on AWS it may make sense to design our pipeline with their CI/CD services.
The AWS service which can be used for our case could be CodePipeline. 

  1. The developer commits a feature of the service to github/ CodeCommit repository.
  2. We can then use CodeBuild (AWS offering similiar to jenkins) to build our recently committed code. 
  We can specify the build specification in our buildspec.yml file
  3. The built artifact can now be directly 'deployed' using the CodeDeploy service or stored in an s3 bucket. 
  4. Using a service such as AWS elastic beanstalk instance we can then run our built artifact that is stored in the bucket. 

The secreenshots folder contains pictures of the reduction in the size of the images after using an alpine image (236MB) and finally after using a multi-stage build process (140MB).


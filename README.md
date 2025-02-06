# TMS_30_Perscent-without-ProfilePicture-

You can use below link to know how to create this app

https://available-soon

**If you face any error after doing below steps, then please update current version of your installed NodeJS software.**

**How to Run:**

- Open VS code terminal and type command

      npm install

- Above command will install all neccessary packages and create node_modules folder in your downloaded code.

- Now run below command to run this app

      npm run dev

- Import database into MongoDB Compass:

      1. Open MongoDB Compass.
      2. Create new database named as "task_management" and collection name as "register_user". These names are defined in src/app/api/register/route.ts
      3. If you want to add our created-data, then you can follow below instructions.
            a. Before proceed instructions, it is noted that if you already created data, then unique ID may be duplicated with our Data-IDs. Therefore, be carefull otherwise database-error may rise.
            Create database and collection as mentioned above.
            b. Navigate to the database and click on "Add Data" > "Import File"
            c. Select the task_management.register_user.json file and import it into the appropriate collection
  - Resend:
    I have used resebd fir sending email verification to user email.
    there are some limitaion till now:
     1. Email can be send to the email which is used to register API.
    This can be resolved by using the Domain you have owned and putting it in the Resend account. THrough this you can send verification email to any email address.



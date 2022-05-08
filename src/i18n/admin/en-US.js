export const m = {
  // /views/admin/Login.vue
  Welcome_to_Login_Admin: 'Welcome to Login Background Management System',
  Login: 'Login',
  Please_enter_username: 'Please enter username',
  Please_enter_password: 'Please enter password',
  Admin_Login_Success: 'Dear administrator, welcome back~',
  Please_check_your_username_or_password: 'Please check your username or password',

  // /views/admin/Home.vue
  Dashboard: 'Dashboard',
  General: 'General',
  User_Admin: 'Admin User',
  Announcement_Admin: 'Announcement',
  System_Config: 'System Config',
  Problem_Admin: 'Problem',
  Problem_List: 'Problem List',
  Create_Problem: 'Create Problem',
  Export_Import_Problem: 'Export | Import Problem',
  Training_Admin: 'Training',
  Training_List: 'Training List',
  Create_Training: 'Create Training',
  Admin_Category: 'Admin Category',
  Contest_Admin: 'Contest',
  Contest_List: 'Contest List',
  Create_Contest: 'Create Contest',
  Discussion: 'Discussion',
  Discussion_Admin: 'Admin Discussion',
  Home_Page: 'Home Page',
  Logout: 'Logout',

  // /views/admin/Dashboard.vue
  Last_Login: 'Last Login',
  Super_Admin: 'Super Admin',
  Admin: 'Admin',
  All_Problem_Admin: 'Problem Admin',
  Total_Users: 'Total Users',
  Today_Submissions: 'Today Submissions',
  Recent_14_Days_Contests: 'Recent 14 Days Contests',
  Backend_System: 'Backend System',
  Server_Number: 'Server Number',
  Nacos_Status: 'Nacos Status',
  HTTPS_Status: 'HTTPS Status',
  Backend_Service: 'Backend Service',
  Name: 'Name',
  Host: 'Host',
  Port: 'Port',
  CPU_Core: 'CPU Core',
  CPU_Usage: 'CPU Usage',
  Mem_Usage: 'Mem Usage',
  Healthy: 'Healthy',
  Secure: 'Secure',
  Healthy_Status: 'Healthy',
  Unhealthy: 'Unhealthy',
  Judge_Server: 'Judge Server',

  // /views/admin/general/User.vue
  General_User: 'User',
  Created_Time: 'Created Time',
  Delete: 'Delete',
  Forbid: 'Forbid',
  OnlyAdmin: 'OnlyAdmin',
  User_Type: 'User Type',
  Normal: 'Normal',
  Disable: 'Disable',
  Edit_User: 'Edit User',
  Delete_User: 'Delete User',
  Import_User: 'Import User',
  Import_User_Tips1: 'The imported user data only supports user data in CSV format.',
  Import_User_Tips2: 'There are seven columns of data: username, password, email, realname and gender. The username and password cannot be empty, others can be enmpty, otherwise the data in this row may fail to be imported.',
  Import_User_Tips3: 'The first line does not need to write the seven column names ("username", "password", "email","realname","gender","nickname","school").',
  Import_User_Tips4: 'If the gender is male, please use "male" or "0", if the gender is female, please use "female" or "1". If it is not filled in, it is assumed to be "secrecy".',
  Import_User_Tips5: 'Please import the file saved as UTF-8 code, otherwise Chinese may be garbled.',
  Choose_File: 'Choose File',
  Password: 'Password',
  Upload_All: 'Upload All',
  Clear_All: 'Clear All',
  Generate_User: 'Generate User',
  Prefix: 'Prefix',
  Suffix: 'Suffix',
  Start_Number: 'Start Number',
  End_Number: 'End Number',
  Extra_Account: 'Extra Accounts Allowed to The Contest',
  Extra_Account_Tips: 'Please enter the username of the account allowed to enter to the contest, separated by line break.',
  Password_Length: 'Password Length',
  Generate_and_Export: 'Generate & Export',
  The_usernames_will_be: 'The usernames will be',
  Set_New_PWD: 'Set PWD',
  General_New_Password: 'New PWD',
  The_end_number_cannot_be_less_than_the_start_number: 'The end number cannot be less than the start number',
  Please_select_6_to_25_characters_for_password_length: 'Please select 6 ~ 25 characters for password length',
  Start_Number_Required: 'The Start Number is required.',
  End_Number_Required: 'The End Number is required.',
  Password_Length_Checked: 'Password length must be numeric',
  Delete_User_Tips: 'Are you sure you want to delete this user? May be associated to delete the user created announcements, topics, competitions, etc.',
  The_number_of_users_selected_cannot_be_empty: 'The number of users selected cannot be empty',
  Error_Please_check_your_choice: 'Wrong, please check your choice.',
  Generate_User_Success: 'All users in the specified format have been created successfully, and the user table has been downloaded to your computer successfully!',
  Generate_Skipped_Reason: 'rows user data are filtered because it may be an empty row or a column(username or password) value is empty.',
  Upload_Users_Successfully: 'Upload Users Successfully',

  // /views/admin/general/Announcement.vue
  General_Announcement: 'Announcement',
  Create: 'Create',
  Modified_Time: 'Modified Time',
  Edit_Announcement: 'Edit Announcement',
  Create_Announcement: 'Create Announcement',
  Delete_Announcement: 'Delete Announcement',
  Announcement_Title: 'Title',
  Announcement_Content: 'Content',
  Announcement_visible: 'Visible',
  Delete_Announcement_Tips: 'Are you sure you want to delete this announcement?',

  // /views/admin/general/SysNotice.vue
  SysNotice: 'Notification',
  Notice_Admin: 'Notification',
  Push_System_Notification_Every_Hour: 'Tips: Push System Notification Every Hour',
  Edit_Notice: 'Edit Notification',
  Create_Notice: 'Create Notification',
  Delete_Notice: 'Delete Notification',
  Notice_Title: 'Notification Title',
  Notice_Content: 'Notification Content',
  Notice_Push: 'Pushed',
  Notice_Recipient: 'Recipient',
  All_User: 'All User',
  Designated_User: 'Designated User',
  All_Admin: 'Admin',
  Delete_Notice_Tips: 'Are you sure you want to delete this notification?',

  // /views/admin/general/SystemConfig.vue
  Website_Config: 'Website Config',
  Base_Url: 'Base Url',
  Web_Name: 'Web Name',
  Short_Name: 'Short Name',
  Record_Name: 'Record Name',
  Record_Url: 'Record Url',
  Project_Name: 'Project Name',
  Project_Url: 'Project Url',
  Web_Desc: 'Web Desc',
  Allow_Register: 'Allow Register',
  Home_Rotation_Chart: 'Home Rotation Chart',
  SMTP_Config: 'SMTP Config',
  Email_BG: 'BG IMG',
  Email_BG_Desc: 'SMTP Template Background IMG Address',
  Send_Test_Email: 'Send Test Email',
  Email: 'Email',
  DataSource_Config: 'DataSource Config',
  Please_input_your_email: 'Please input your email',
  Code_Visible_Start_Time: 'Visible range of user code',

  // /views/admin/problem/ProblemList.vue
  Contest_Problem_List: 'Contest Problem List',
  Display_ID: 'Display ID',
  Display_Title: 'Display Title',
  Original_Display: 'Original Display',
  Contest_Display: 'Contest Display',
  Add_Rmote_OJ_Problem: 'Add Remote OJ Problem',
  Add_From_Public_Problem: 'Add From Public Problem',
  Auth: 'Auth',
  Modified_User: 'Modified User',
  All_Problem: 'All Problem',
  Public_Problem: 'Public Problem',
  Private_Problem: 'Private Problem',
  Contest_Problem: 'Contest Problem',
  Download_Testcase: 'Download Testcase',
  Add_Contest_Problem: 'Add Contest Problem',
  Remote_OJ: 'Remote OJ',
  Add: 'Add',
  Remove: 'Remove',
  Delete_Problem_Tips: 'Are you sure you want to delete this problem? Note: the relevant submission data for this issue will also be deleted.',
  Remove_Contest_Problem_Tips: 'Are you sure you want to remove the problem from the contest?',
  Add_Successfully: 'Add Successfully',
  Download_Testcase_Success: 'The testcase of this problem has been downloaded successfully!',
  Enter_The_Problem_Display_ID_in_the_Contest: 'Enter The Problem Display ID in the Contest',
  The_Problem_Display_ID_in_the_Contest_format_error: 'The Problem Display ID is in numeric format',
  Problem_ID_is_required: 'Problem ID is required',
  The_Problem_Display_ID_in_the_Contest_is_required: 'The Problem Display ID in the Contest is required',
  Balloon_Color: 'Balloon Color',
  Update_Balloon_Color_Successfully: 'Update the Balloon color of the problem successfully!',

  // /views/admin/problem/Problem.vue
  Problem_Display_ID: 'Problem Display ID',
  Title: 'Title',
  Contest_Display_Title: 'Contest Display Title',
  Contest_Display_ID: 'Contest Display ID',
  Description: 'Description',
  Input_Description: 'Input Description',
  Output_Description: 'Output Description',
  Time_Limit: 'Time Limit',
  Memory_Limit: 'Memory Limit',
  Stack_Limit: 'Stack Limit',
  Code_Shareable: 'Code Shareable',
  Languages: 'Languages',
  Problem_Examples: 'Problem Examples',
  Problem_Examples_Desc: 'Problem Examples: please do not have more than 2 problem examples. Problem examples are not included in the testcase.',
  Problem_Example: 'Example',
  Example_Input: 'Example Input',
  Example_Output: 'Example Output',
  Add_Example: 'Add Example',
  Judge_Mode: 'Judge Mode',
  General_Judge: 'General Judge',
  Special_Judge: 'Special Judge',
  Interactive_Judge: 'Interactive Judge',
  Special_Judge_Code: 'Special Judge Program Code',
  Interactive_Judge_Code: 'Interactive Judge Program Code',
  General_Judge_Mode_Tips: 'General Judge: the contestant program reads the problem standard input file, executes the code logic to obtain the contestant\'s output, and compares the contents of the problem standard output file to obtain the problem judgment result',
  Special_Judge_Mode_Tips: 'Special Judge: the output results required by the problem may not be unique, and different results are allowed. Therefore, a special program is needed to read standard output, player output and standard input, and compare them to obtain the final judgment result',
  Interactive_Judge_Mode_Tips: 'Interactive Judge: the standard output of the interactive program is written to the standard input of the player program through the interactive channel, and the standard output of the player program is written to the standard input of the interactive program through the interactive channel. Both need to flush the output buffer',
  Use_Special_Judge: 'Use Special Judge',
  SPJ_Language: 'SPJ Program Language',
  Interactive_Language: 'Interactive Program Langugae',
  Compile: 'Compile',
  Code_Template: 'Code Template',
  Type: 'Type',
  Judge_Samples: 'Judge Samples',
  Problem_Sample: 'Sample',
  Sample_Input: 'Sample Input',
  Sample_Output: 'Sample Output',
  Sample_Input_File: 'Input File',
  Sample_Output_File: 'Output File',
  Sample_Tips: 'Sample: the data source of the judger to test the submission.',
  Add_Sample: 'Add Sample',
  Use_Upload_File: 'Use Upload File',
  Use_Manual_Input: 'Use Manual Input',
  Hint: 'Hint',
  Source: 'Source',
  Auto_Remove_the_Blank_at_the_End_of_Code: 'Automatically Remove Whitespace at The End of Each Line of Code',
  Publish_the_Judging_Result_of_Test_Data: 'Publish the Judging Result of Test Data',
  Edit_Problem: 'Edit Problme',
  Create_Problme: 'Create Problem',
  Change_Judge_Mode: 'Note: switching the judgment mode may change the evaluation logic!',
  Add_Tag_Error: 'The tag has been added, please do not add it repeatedly!',

  Upload_Testcase_Successfully: 'Upload Testcase Successfully',
  Upload_Testcase_Failed: 'Upload Testcase Failed',
  is_required: 'is required!',
  Score_must_be_greater_than_or_equal_to_0: 'Score must be greater than or equal to 0!',
  Score_must_be_an_integer: 'Score must be an integer!',
  Spj_Or_Interactive_Code: 'Spj Or Interactive Code',
  Spj_Or_Interactive_Code_not_Compile_Success: 'Spj Or Interactive Code was not compiled successfully, please compile again!',
  Judge_Extra_File: 'Judge Extra File',
  Judge_Extra_File_Tips1: '1. User Program: Provide additional library files for user program',
  Judge_Extra_File_Tips2: '2. Special Or Interactive Program: Provide additional library files for special or interactive programs',
  User_Program: 'User Program',
  SPJ_Or_Interactive_Program: 'Special Or Interactive Program',


  // /views/admin/problem/tag
  Admin_Tag: 'Admin Tag',
  Add_Tag: 'Add Tag',
  Update_Tag: 'Update Tag',
  Tag_Name: 'Tag Name',
  Tag_Color: 'Tag Color',
  Tag_Attribution: 'Tag Attribution',
  Delete_Tag_Tips: 'Are you sure you want to delete this tag?',


  // /views/admin/training/TrainingList.vue
  Order_Number: 'Order Number',
  View_Training_Problem_List: 'View Training Problem List',
  Delete_Training_Tips: 'This operation will delete the training and its submission, rank record and other data. Do you want to continue?',

  // /views/admin/training/Training.vue
  Training_rank: 'Training Sort Number (Ascending Sort)',
  Training_Title: 'Training Title',
  Training_Description: 'Training Description',
  Training_Auth: 'Training Auth',
  Training_Category: 'Training Category',
  Public_Training: 'Public Training',
  Private_Training: 'Private Training',
  Training_Password: 'Training Password',
  Edit_Training: 'Edit Training',
  Redirect_To_Category: 'The category list of current training is empty. Please go to create category first!',
  Redirect: 'Redirect',

  // /views/admin/training/TrainingProblemList.vue
  Training_Problem_List: 'Training Problem List',
  Add_Training_Problem: 'Add Training Problem',
  Remove_Training_Problem_Tips: 'Are you sure you want to remove the problem from the training?',
  Training_Problem_Rank: 'Title Display Order(Ascending)',

  // /views/admin/training/Category.vue
  Add_Category: 'Add Category',
  Update_Category: 'Update Category',
  To_Add: 'Add',
  To_Update: 'Update',
  Category_Name: 'Category Name',
  Category_Color: 'Category Color',
  Delete_Category_Tips: 'Are you sure you want to delete this category?',

  // /views/admin/problem/ImportAndExport.vue
  Export_Problem: 'Export Problem',
  Export: 'Export',
  Import_Problem: 'Import Problem',
  Import_QDOJ_Problem: 'Import QDOJ Problem',
  Import_FPS_Problem: 'Import FPS Problem',
  Export_Problem_NULL_Tips: 'The problem selected for export cannot be empty',

  // /views/admin/contest/ContestList.vue
  Visible: 'Visible',
  Info: 'Info',
  View_Contest_Problem_List: 'View Contest Problem List',
  View_Contest_Announcement_List: 'View Contest Announcement List',
  Download_Contest_AC_Submission: 'Download Contest AC Submissions',
  Exclude_admin_submissions: 'Exclude admin submissions',
  SplitType_User: 'Split folders by username',
  SplitType_Problem: 'Split folders by problem id',
  Delete_Contest_Tips: 'This operation will delete the contest and its submission, discussion, announcement, record and other data. Do you want to continue?',

  // /views/admin/contest/Contest.vue
  Contest_Title: 'Contest Title',
  Contest_Description: 'Contest Description',
  Start_Time: 'Start Time',
  Contest_End_Time: 'End Time',
  Contest_Duration: 'Contest Duration',
  Contest_Rule_Type: 'Contest Rule Type',
  Seal_Time_Rank: 'Seal Time Rank',
  Real_Time_Rank: 'Real Time Rank',
  Seal_Rank_Time: 'Seal Rank Time',
  Contest_Auth: 'Contest Auth',
  Contest_Password: 'Contest Password',
  OI_Rank_Score_Type: 'OI RANK Score Type',
  OI_Rank_Score_Type_Recent: 'Use Recent Score',
  OI_Rank_Score_Type_Highest: 'Use Highest Score',
  Contest_Seal_Half_Hour: 'Half an hour',
  Contest_Seal_An_Hour: 'An hour',
  Contest_Seal_All_Hour: 'All hours',
  Auto_Real_Rank: 'Auto_Real_Rank',
  Real_Rank_After_Contest: 'Real Rank After Contest',
  Seal_Rank_After_Contest: 'Seal Rank After Contest',
  Edit_Contest: 'Edit Contest',
  Contest_Duration_Check: 'The duration of the contest cannot be less than or equal to zero!',
  Contest_Time_Check: 'The start time should be earlier than the end time!',
  Print_Func: 'Print Function',
  Open: 'Open',
  Not_Support_Print: 'Not Support Print',
  Support_Offline_Print: 'Support Offline Print',
  Add_Star_User_Error: 'Please do not add existing star user repeatedly!',
  Star_User_UserName: 'Star User (Please use login username)',
  Rank_Show_Name: 'The Name Showed in The Rank',
  Show_Username: 'Username',
  Show_Nickname: 'Nickname',
  Show_Realname: 'Real name',
  Password_Limit: 'Password Limit',
  Account_Limit: 'Account Limit (Login Username)',
  The_allowed_account_will_be: 'The allowed username will be ',
  Contest_Auth_Check_Tip: 'Password Limit and Account Limit require at least one',

  // /views/admin/discussion/Discussion.vue
  Discussion_ID: 'Discussion ID',
  Top: 'Top',
  Discussion_Report: 'Discussion Report',
  Reporter: 'Reporter',
  Report_Time: 'Report Time',
  View_Report_content: 'View Report Content',
  View_Discussion: 'View Discussion Detail',
  Content: 'Content',
  Report_Content: 'Report Content',
  The_number_of_discussions_selected_cannot_be_empty: 'The number of discussions selected cannot be empty',

  // components/admin/AddExtraFile.vue
  Delete_Extra_File_Tips: 'Are you sure you want to delete this extra file?',
  File_Name: 'File Name',
  File_Content: 'File Content'
}

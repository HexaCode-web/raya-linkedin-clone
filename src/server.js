import React from "react";
import ReactDOMServer from "react-dom/server";

import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getFirestore,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
  listAll,
  uploadBytesResumable,
} from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  updateEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { con } from "./Conf.js";
export const app = initializeApp(con);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export const UPLOADVIDEO = async (path, photo, onProgress) => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, photo);

  // Subscribe to the "state_changed" event to track the upload progress
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress); // Pass the progress value to the provided onProgress callback
    },
    (error) => {
      throw new Error(`Error uploading photo: ${error.message}`);
    }
  );

  try {
    await uploadTask; // Wait for the upload to complete
    const url = await getDownloadURL(uploadTask.snapshot.ref);
    return url;
  } catch (error) {
    throw new Error(`Error getting download URL: ${error.message}`);
  }
};

export const UPLOADPHOTO = async (path, photo) => {
  const snapshot = await uploadBytes(ref(storage, path), photo);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};
export const EMPTYFOLDER = async (path) => {
  const listRef = ref(storage, path);
  listAll(listRef)
    .then((res) => {
      res.items.forEach((itemRef) => {
        deleteObject(itemRef);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
export const DELETEPHOTO = async (path) => {
  await deleteObject(ref(storage, path));
};
export const GETCOLLECTION = async (target) => {
  try {
    const cleanData = [];
    const srcData = await getDocs(collection(db, target));
    srcData.forEach((doc) => {
      const info = doc.data();
      cleanData.push(info);
    });
    return cleanData;
  } catch (error) {
    return error;
  }
};
/** 
    await GETCOLLECTION("users").then((response) => {
   cleanData = response;
});
*/
export const UPDATEEMAIL = async (newEmail = "") => {
  try {
    onAuthStateChanged(auth, (user) => {
      updateEmail(user, newEmail);
    });
    return "Email updated successfully";
  } catch (error) {
    throw new Error(error.message);
  }
};

export const SIGNOUT = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      console.log(error);
    });
};

export const LOGIN = async (Email, Password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      Email,
      Password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const NEWUSER = async (Email, Password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      Email,
      Password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const DELETEUSER = async (id) => {
  const userToDelete = await GETDOC("users", id);
  await SETDOC("users", id, {
    ...userToDelete,
    deleteUser: true,
    Username: "",
  });
  try {
    return "user Deleted";
    // eslint-disable-next-line no-unreachable
  } catch (error) {
    throw error.message;
  }
};
export const DELETECURRENTUSER = async () => {
  const user = auth.currentUser;
  deleteUser(user).catch((error) => {
    console.log(error);
  });
};
export const RESETPASSWORD = (email) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Email sent.
      console.log("Password reset email sent successfully");
    })
    .catch((error) => {
      console.log(error);
      // An error happened.
    });
};
export const GETDOC = async (collection = String, id = Number) => {
  try {
    const docSnap = await getDoc(doc(db, collection, id.toString()));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return "Error";
    }
  } catch (error) {
    return error;
  }
};
//      GETDOC("users", user.id).then((value) => { });
export function encrypt(str) {
  let shift = 3;
  let result = "";
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      result += String.fromCharCode(((charCode - 65 + shift) % 26) + 65);
    } else if (charCode >= 97 && charCode <= 122) {
      result += String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}

// Decryption function
export function decrypt(str) {
  let shift = 3;
  let result = "";
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      result += String.fromCharCode(((charCode - 65 - shift + 26) % 26) + 65);
    } else if (charCode >= 97 && charCode <= 122) {
      result += String.fromCharCode(((charCode - 97 - shift + 26) % 26) + 97);
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}
export const SETDOC = async (
  collection = String,
  id = Number,
  newValue = Object,
  New = ""
) => {
  if (New) {
    await setDoc(doc(db, collection, id.toString()), newValue);
  }
  const res = await GETDOC(collection, id);
  if (res === "Error") {
    throw new Error(`No data found`);
  } else {
    await setDoc(doc(db, collection, id.toString()), newValue);
  }
};
//         SETDOC("users", tempData.id, { ...tempData });

export const UPDATEDOC = async (collection = String, id, newData = Object) => {
  try {
    await updateDoc(doc(db, collection, id.toString()), newData);
  } catch (error) {
    console.log(error);
  }
};
export const DELETEDOC = async (collection = String, id = Number) => {
  try {
    await deleteDoc(doc(db, collection, id.toString()));
  } catch (error) {
    console.log(error);
  }
};
export async function Distributor(Items = [], CategoryContainer = []) {
  CategoryContainer.forEach((category) => {
    category.Articles = [];
  });
  Items.forEach((Item) => {
    CategoryContainer.forEach((Container) => {
      if (Item.category === Container.Name) {
        if (Container.Articles.length === 0) {
          Container.Articles.push(Item);
        } else {
          if (Container.Articles.find((innerItem) => innerItem.id == Item.id)) {
            return;
          } else {
            Container.Articles.push(Item);
          }
        }
      }
    });
  });
  for (let index = 0; index < CategoryContainer.length; index++) {
    setTimeout(async () => {
      await SETDOC("categories", CategoryContainer[index].id, {
        ...CategoryContainer[index],
      });
    }, 500);
  }
}
export async function SENDMAIL(
  EmailTemplateComponent,
  receiverEmail,
  receiverName,
  EmailHeader,
  formData,
  EmailSubject
) {
  const getEmailHTML = () => {
    const emailTemplate = (
      <EmailTemplateComponent formData={formData} EmailHeader={EmailHeader} />
    );
    const htmlString = `
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          ${ReactDOMServer.renderToStaticMarkup(emailTemplate)}
        </body>
      </html>
    `;
    return htmlString;
  };

  const emailHtml = getEmailHTML();

  const emailData = {
    sender: {
      name: receiverName,
      email: formData.Email,
    },
    to: [
      {
        email: receiverEmail,
        name: receiverName,
      },
    ],
    subject: EmailSubject,
    htmlContent: emailHtml,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      accept: "application/json",
      // eslint-disable-next-line no-undef
      "api-key": process.env.REACT_APP_EMAILKEY,
      "content-type": "application/json",
    },
    body: JSON.stringify(emailData),
  };
  try {
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`Email sending failed with status: ${response.status}`);
    }

    return "Email was sent successfully"; // Return success message
  } catch (error) {
    return error.message; // Return the error message
  }
}

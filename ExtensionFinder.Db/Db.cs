using ExtensionFinder.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExtensionFinder.Db
{

    public class Db
    {
        private static Db db = null;
        private static readonly object Lock = new object();

        public static Db GetDb
        {
            get
            {
                lock (Lock)
                {
                    if(db == null)
                    {
                        db = new Db();
                    }
                    return db;
                }
            }
        }

        private List<Extension> extensions = new List<Extension>();
        private int LastFreeIndex = 0;

        private Db()
        {
            LoadJson();
        }

        private void LoadJson()
        {
            using (System.IO.StreamReader r = new System.IO.StreamReader("file_extensions.json"))
            {
                string json = r.ReadToEnd();
                List<JsonExtension> jsonExtensions = JsonConvert.DeserializeObject<List<JsonExtension>>(json);
                jsonExtensions.ForEach(jsonExtension =>
                    {
                        var extension = new Extension(LastFreeIndex++, jsonExtension.extension, jsonExtension.description);
                        extensions.Add(extension);
                    }
                );
            }
        }

        public List<Extension> List
        {
            get
            {
                return extensions.ToList();
            }
        }

        public void Add(Extension extension)
        {
            extension = new Extension(LastFreeIndex++, extension.Name, extension.Description);
            extensions.Add(extension);
        }

    }
}

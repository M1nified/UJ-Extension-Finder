using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExtensionFinder.Models
{
    public class Extension
    {
        readonly int id;
        string name;
        string description;

        public string Name { get => name; set => name = value; }
        public string Description { get => description; set => description = value; }

        public int Id => id;

        public Extension(int id, string name, string description)
        {
            this.id = id;
            this.name = name;
            this.description = description;
        }
    }
}
